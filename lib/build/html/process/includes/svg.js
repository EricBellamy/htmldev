const HTMLParser = require('node-html-parser');
const svgo = require('svgo');

module.exports = {
	load: true, // Loads the file before process
	afterHtmlValidation: true,
	compile: async function(contents){
		return svgo.optimize(contents).data;
		// return contents;
	},
	process: async function (template, node, contents, lazymanager, FILE_PATH, PARENT_PATH) {
		if(node.attributes.inline != undefined){
			// Eliminate any garbage surrounding the SVG tag
			const parsedSvg = HTMLParser.parse(contents);
			parsedSvg.removeWhitespace();
			contents = parsedSvg.querySelector('svg').toString();

			// Inline it in the HTML
			node.replaceWith(contents);
		} else {
			node.setAttribute('lazy', '');
			const shouldContinue = await global.HTMLDEV_PRIVATE.activateHook("svg", "start", template, node, contents, FILE_PATH, PARENT_PATH);
			if (!shouldContinue) return;

			node.replaceWith("");

			await global.HTMLDEV_PRIVATE.activateHook("svg", "finish", template, node, contents, FILE_PATH, PARENT_PATH);
		}
	}
}