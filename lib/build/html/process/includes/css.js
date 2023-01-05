const minifyCSS = new (require('clean-css'));
const stylelint = require('stylelint');
const config = require('stylelint-config-standard');
config.rules.indentation = "tab";
config.rules['no-missing-end-of-source-newline'] = false;
config.rules['rule-empty-line-before'] = false;

module.exports = {
	load: true, // Loads the file before process
	minify: async function (contents) {
		return await minifyCSS.minify(contents).styles;
	},
	process: async function (template, node, contents, lazymanager, FILE_PATH, PARENT_PATH) {
		const lint = await stylelint.lint({
			code: contents,
			config: { rules: config.rules }
		});
		const result = lint.results[0];
		const errors = [];
		for (const warning of result.warnings) {
			const warningText = warning.text.split(`(${warning.rule})`);
			errors.push([
				['red', `[CSS Validation] ${warningText[0].trim()} (`],
				['magenta', warning.rule],
				['red', ') ['],
				['magenta', warning.line],
				['red', ':'],
				['magenta', warning.column],
				['red', '] in file "'],
				['magenta', FILE_PATH],
				['red', '" within "'],
				['magenta', PARENT_PATH],
				['red', '"'],
			]);
		}

		if (0 < errors.length) {
			node.replaceWith('');
			return errors;
		} else {
			if (node.attributes.lazy != undefined) {
				lazymanager.register(node.attributes.src, node.attributes.raw === undefined);
				node.replaceWith('');
			} else {
				let minifyResult = contents;
				if (node.attributes.raw === undefined) minifyResult = await module.exports.minify(contents);
				node.replaceWith(`<style>${minifyResult}</style>`);
			}
			return;
		}
	}
}