const fs = require('fs-extra');
const path = require('path');

const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');
// const lazymanager = new (require(__htmldev_root + '/lib/module/lazymanager.js'));

const includeLinks = {
	'.html': require(__htmldev_root + '/lib/build/html/process/includes/html.js'),
	'.js': require(__htmldev_root + '/lib/build/html/process/includes/javascript.js'),
	'.css': require(__htmldev_root + '/lib/build/html/process/includes/css.js'),
	'.scss': require(__htmldev_root + '/lib/build/html/process/includes/scss.js'),
	'.ico': require(__htmldev_root + '/lib/build/html/process/includes/ico.js'),
	'.svg': require(__htmldev_root + '/lib/build/html/process/includes/svg.js'),
};
const includeLinksPicture = require(__htmldev_root + '/lib/build/html/process/includes/picture.js');
includeLinks['.png'] = includeLinksPicture;
includeLinks['.jpg'] = includeLinksPicture;
includeLinks['.jpeg'] = includeLinksPicture;

function getIncludeNodes(parsed, isAfterValidation = false) {
	let includeNodes = parsed.querySelectorAll('include');
	// Remove the node if we're not able to process it yet
	for (let a = 0; a < includeNodes.length; a++) {
		const ext = path.extname(includeNodes[a].attributes.src);
		if (ext.indexOf('.') != -1 &&
			((isAfterValidation === false && includeLinks[ext].afterHtmlValidation === true) ||
				(isAfterValidation === true && includeLinks[ext].afterHtmlValidation != true))
		) includeNodes.splice(a--, 1);
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
				const ext = path.extname(node.attributes.src);
				const noDotExt = ext.substring(1);
				if (ext.indexOf('.') === -1) {
					colorLog(['red', `INCLUDES :: <include> invalid file extension with src "`],
						['magenta', node.attributes.src],
						['red', '" in '],
						['magenta', RELATIVE_FILE_PATH]);
					return false;
				} else {
					// Process the includes
					switch (ext) {
						case '.html':
						// Load template HTML
						case '.js':
						// Inline by default
						// Support "lazy" attribute
						case '.css':
						// Inline by default
						// Support "lazy" attribute
						case '.scss':
						// Inline by default
						// Support "lazy" attribute
						case '.ico':
						// Lazy load by default
						case '.png':
						case '.jpg':
						case '.jpeg':
						// Picture element & lazy by default
						case '.svg':
							// Lazy load by default
							// Support "inline" attribute
							const filePath = `${process.cwd()}/include/${noDotExt}/${node.attributes.src}`;

							// If we need to autoload the file contents
							let contents;
							if (includeLinks[ext].load) contents = fs.readFileSync(filePath, 'utf8');

							const processErrors = await includeLinks[ext].process(parsed, node, contents, {}, `include/${noDotExt}/${node.attributes.src}`, RELATIVE_FILE_PATH);
							if (processErrors != undefined) {
								colorLog.batch(processErrors);
								return false;
							}

							// Process lazy files
							// Push them to a lazy array
							// Make sure the files are exported to the "dist" folder
							// Insert a <script> at the end of the body that loads these files
							// Create a callback function that is executed when all files in the input array are loaded, throws an error if the file does not exist

							break;
					}
				}
			}
		}

		includeNodes = getIncludeNodes(parsed, isAfterValidation);
	}
}

module.exports = {
	beforeValidation: async function (parsed, RELATIVE_FILE_PATH) {
		return await processIncludes(parsed, RELATIVE_FILE_PATH, false);
	},
	afterValidation: async function (parsed, RELATIVE_FILE_PATH) {
		const includeError = await processIncludes(parsed, RELATIVE_FILE_PATH, true);
		if(includeError != undefined) return includeError;

		// Create the files in the dist folder
		// await lazymanager.createDistFiles();
		// parsed.querySelector('head').innerHTML = await lazymanager.pre() + parsed.querySelector('head').innerHTML;
		// parsed.querySelector('body').innerHTML += await lazymanager.post();
	}
}