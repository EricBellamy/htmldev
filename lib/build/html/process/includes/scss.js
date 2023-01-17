const sass = require('node-sass');
const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');

// Our CSS handler for the compiled SCSS
const includeCSS = require(__htmldev_root + '/lib/build/html/process/includes/css.js');

module.exports = {
	load: true, // Loads the file before process
	minify: async function (contents) {
		return await includeCSS.minify(contents);
	},
	compile: function (contents) {
		const result = sass.renderSync({
			data: contents
		});
		return result.css.toString();
	},
	exportPath: function (path) {
		return path.split('.scss')[0] + ".css";
	},
	process: async function (template, node, contents, FILE_PATH, PARENT_PATH) {
		let minifyResult = module.exports.compile(contents);

		// Check if our CSS has any major errors
		const errors = await includeCSS.validate(minifyResult, FILE_PATH, PARENT_PATH);
		if (0 < errors.length) {
			node.replaceWith('');
			return errors;
		} else {
			// Callback hooks & stop processing if needed
			const shouldContinue = await global.HTMLDEV_PRIVATE.activateHook("scss", "start", template, node, contents, FILE_PATH, PARENT_PATH);
			if (!shouldContinue) return;

			if (node.attributes.raw === undefined) minifyResult = await includeCSS.minify(minifyResult);
			node.replaceWith(`<style>${minifyResult}</style>`);

			await global.HTMLDEV_PRIVATE.activateHook("scss", "finish", template, node, contents, FILE_PATH, PARENT_PATH);
		}
	}
}