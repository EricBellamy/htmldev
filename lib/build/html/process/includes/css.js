const minifyCSS = new (require('clean-css'));
const stylelint = require('stylelint');
const config = require('stylelint-config-standard');
config.rules.indentation = "tab";
config.rules['no-missing-end-of-source-newline'] = false;
config.rules['rule-empty-line-before'] = false;

module.exports = {
	load: true, // Loads the file before process
	process: async function (template, node, contents, LAZY_URLS, FILE_PATH, PARENT_PATH) {
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
			let minifyResult = contents;
			if (node.attributes.raw === undefined) minifyResult = minifyCSS.minify(contents).styles;
			if (node.attributes.lazy != undefined) {
				// Lazy load this file
				// Save this file into the dist folder ("include/**")
				// Add the exported file into a lazy load array that gets appended to the HTML file
				LAZY_URLS.push(node.attributes.src);
			}

			node.replaceWith(`<style>${minifyResult}</style>`);
			return;
		}
	}
}