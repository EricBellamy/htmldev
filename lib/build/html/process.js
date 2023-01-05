const fs = require('fs-extra');
const HTMLParser = require('node-html-parser');

const preprocessHtml = require('./process/pre.js');
const validateHtml = require('./process/validate.js');
const processIncludes = require('./process/includes.js');
const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');

module.exports = {
	load: async function (FILE_PATH, INPUT_DATA) {
		const RELATIVE_FILE_PATH = FILE_PATH.split(process.cwd())[1].substring(1);

		// Load the file contents
		const html = fs.readFileSync(FILE_PATH, 'utf8');
		const stats = fs.statSync(FILE_PATH);

		const OUTPUT = {
			updated: {}
		};
		OUTPUT.updated[FILE_PATH] = stats.mtimeMs;
		__currentbuild.updated[FILE_PATH] = stats.mtimeMs;

		let parsed = HTMLParser.parse(html);

		// Fix generic HTML format errors
		parsed = await preprocessHtml(parsed, FILE_PATH);

		// Process data & includes
		let includesError = await processIncludes.beforeValidation(parsed, RELATIVE_FILE_PATH);
		if (includesError === false) return false; // Blocking error in the include tags

		// Post process - Lazy load necessary files


		// Is the HTML file valid or will we be penalized by google
		const validation = await validateHtml(parsed.toString(), RELATIVE_FILE_PATH);
		if (validation === true) {
			// Do the final HTML processing that would interfere with the HTML validation -- SVG inlining etc...
			includesError = await processIncludes.afterValidation(parsed, RELATIVE_FILE_PATH);
			if (includesError === false) return false; // Blocking error in the include tags

			parsed.removeWhitespace();
			OUTPUT.html = parsed.toString();
			return OUTPUT; // html, modified
		} else {
			colorLog(['yellow', '[PROCESSING] Failed HTML validation for "'],
				['cyan', FILE_PATH],
				['yellow', '"']);
			colorLog.batch(validation);
			return false;
		}
	}
}