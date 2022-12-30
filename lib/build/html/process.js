const fs = require('fs-extra');

const preprocessHtml = require('./process/pre.js');
const validateHtml = require('./process/validate.js');
const processIncludes = require('./process/includes.js');
const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');

module.exports = {
	load: async function (FILE_PATH, INPUT_DATA) {
		// Load the file contents
		const html = fs.readFileSync(FILE_PATH, 'utf8');
		const stats = fs.statSync(FILE_PATH);

		const OUTPUT = {
			updated: {}
		};
		OUTPUT.updated[FILE_PATH] = stats.mtimeMs;
		__currentbuild.updated[FILE_PATH] = stats.mtimeMs;

		let processedHtml;
		processedHtml = await preprocessHtml(html, FILE_PATH);

		// Process data & includes
		processedHtml = await processIncludes(processedHtml, FILE_PATH);
		if(processedHtml === false) return false; // Blocking error in the include tags

		// Post process - Lazy load necessary files
		

		// Is the HTML file valid or will we be penalized by google
		const validation = await validateHtml(processedHtml);
		if (validation === true) {
			OUTPUT.html = processedHtml
			return OUTPUT; // html, modified
		} else {
			colorLog(['yellow', 'PROCESS :: Failed HTML validation for '],
				['cyan', FILE_PATH]);
			colorLog.sameColorLog('red', validation);
			return false;
		}
	}
}