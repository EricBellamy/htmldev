const { minify } = require("terser");

module.exports = {
	load: true, // Loads the file before process
	minify: async function (contents) {
		return (await minify(contents)).code;
	},
	process: async function (template, node, contents, FILE_PATH, PARENT_PATH) {
		if (node.attributes.lazy != undefined) {
			// lazymanager.register(node.attributes.src, node.attributes.raw === undefined);
			node.replaceWith('');
		} else {
			let minifyResult = contents;
			if (node.attributes.raw === undefined) minifyResult = await module.exports.minify(contents);
			node.replaceWith(`<script>${minifyResult}</script>`);
		}
	}
}