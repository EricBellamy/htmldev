const HTMLParser = require('node-html-parser');

module.exports = {
	load: true, // Loads the file before process
	afterHtmlValidation: true,
	process: async function (template, node, contents, lazymanager, FILE_PATH, PARENT_PATH) {
		if(node.attributes.inline != undefined){
			// Eliminate any garbage surrounding the SVG tag
			const parsedSvg = HTMLParser.parse(contents);
			parsedSvg.removeWhitespace();
			contents = parsedSvg.querySelector('svg').toString();

			// Inline it in the HTML
			node.replaceWith(contents);
		} else {
			node.replaceWith("");
		}
	}
}