const fs = require('fs-extra');
const path = require('path');

const colorLog = require(__htmldev_root + '/lib/module/logs/colorLog.js');
const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');
const hasDistFolder = require(__htmldev_root + '/lib/module/files/hasDistFolder.js');
// const lazymanager = new (require(__htmldev_root + '/lib/module/lazymanager.js'));

const includeLinks = {
	'html': require(__htmldev_root + '/lib/build/html/process/includes/html.js'),
	'js': require(__htmldev_root + '/lib/build/html/process/includes/javascript.js'),
	'css': require(__htmldev_root + '/lib/build/html/process/includes/css.js'),
	'scss': require(__htmldev_root + '/lib/build/html/process/includes/scss.js'),
	'ico': require(__htmldev_root + '/lib/build/html/process/includes/ico.js'),
	'svg': require(__htmldev_root + '/lib/build/html/process/includes/svg.js'),
};
const includeLinksPicture = require(__htmldev_root + '/lib/build/html/process/includes/picture.js');
includeLinks['png'] = includeLinksPicture;
includeLinks['jpg'] = includeLinksPicture;
includeLinks['jpeg'] = includeLinksPicture;

function getIncludeNodes(parsed, isAfterValidation = false) {
	let includeNodes = parsed.querySelectorAll('include');
	// Remove the node if we're not able to process it yet
	for (let a = 0; a < includeNodes.length; a++) {
		const ext = getFileType.raw(includeNodes[a].attributes.src);
		const filetype = getFileType(includeNodes[a].attributes.src);
		if (ext.indexOf('.') != -1 &&
			((isAfterValidation === false && includeLinks[filetype].afterHtmlValidation === true) ||
				(isAfterValidation === true && includeLinks[filetype].afterHtmlValidation != true))
		){
			includeNodes.splice(a--, 1);
		} 
	}
	return includeNodes;
}

async function processIncludes(parsed, RELATIVE_FILE_PATH, isAfterValidation = false) {
	// While loop that checks if we have include tags
	// Continuously loads them & their data
	let includeNodes = getIncludeNodes(parsed, isAfterValidation);
	while (includeNodes.length != 0) {
		for (const node of includeNodes) {
			if (node.attributes.src === undefined) {
				colorLog(['red', `INCLUDES :: <include> missing src in `],
					['magenta', RELATIVE_FILE_PATH]);
				return false;
			} else {
				// Make sure this is a valid include file
				if (getFileType.raw(node.attributes.src)[0] != '.') {
					colorLog(['red', `INCLUDES :: <include> invalid file extension with src "`],
						['magenta', node.attributes.src],
						['red', '" in '],
						['magenta', RELATIVE_FILE_PATH]);
					return false;
				} else {
					// This file type can be processed
					if (hasDistFolder.include(node.attributes.src)) {
						const filetype = getFileType(node.attributes.src);

						// Lazy load by default
						// Support "inline" attribute
						const filePath = `${process.cwd()}/include/${filetype}/${node.attributes.src}`;

						// If we need to autoload the file contents
						let contents;
						if (includeLinks[filetype].load) contents = fs.readFileSync(filePath, 'utf8');

						const processErrors = await includeLinks[filetype].process(parsed, node, contents, `include/${filetype}/${node.attributes.src}`, RELATIVE_FILE_PATH);
						if (processErrors != undefined) {
							colorLog.batch(processErrors);
							return false;
						}
					}
				}
			}
		}

		includeNodes = getIncludeNodes(parsed, isAfterValidation);
		break;
	}
}

module.exports = {
	beforeValidation: async function (parsed, RELATIVE_FILE_PATH) {
		return await processIncludes(parsed, RELATIVE_FILE_PATH, false);
	},
	afterValidation: async function (parsed, RELATIVE_FILE_PATH) {
		await global.HTMLDEV_PRIVATE.activateHook("includeAfterValidation", "start", parsed, RELATIVE_FILE_PATH);

		const includeError = await processIncludes(parsed, RELATIVE_FILE_PATH, true);
		if (includeError != undefined) return includeError;

		await global.HTMLDEV_PRIVATE.activateHook("includeAfterValidation", "finish", parsed, RELATIVE_FILE_PATH);
	}
}