const { minify } = require("terser");

module.exports = {
	load: true, // Loads the file before process
	process: async function (template, node, contents) {
		let minifyResult = contents;
		if (node.attributes.raw === undefined) minifyResult = (await minify(contents)).code;
		node.replaceWith(`<script>${minifyResult}</script>`);
	}
}