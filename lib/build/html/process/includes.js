const fs = require('fs-extra');
const path = require('path')
const HTMLParser = require('node-html-parser');

const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');

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

module.exports = async function (HTML_STRING, FILE_PATH) {
	const parsedTemplate = HTMLParser.parse(HTML_STRING);
	parsedTemplate.removeWhitespace();

	// While loop that checks if we have include tags
	// Continuously loads them & their data
	let includeNodes = parsedTemplate.querySelectorAll('include');
	while (includeNodes.length != 0) {
		for (const node of includeNodes) {
			if (node.attributes.src === undefined) {
				colorLog(['red', `INCLUDES :: <include> missing src in `],
					['magenta', FILE_PATH]);
				return false;
			} else {
				const ext = path.extname(node.attributes.src);
				const noDotExt = ext.substring(1);
				if (ext.indexOf('.') === -1) {
					colorLog(['red', `INCLUDES :: <include> invalid file extension with src "`],
						['magenta', node.attributes.src],
						['red', '" in '],
						['magenta', FILE_PATH]);
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

							includeLinks[ext].process(parsedTemplate, node, contents);
							break;
					}
				}
			}
		}

		includeNodes = parsedTemplate.querySelectorAll('include');
	}

	console.log(parsedTemplate.toString());

	return parsedTemplate.toString();
}