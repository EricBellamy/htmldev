const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');

// Require files after global is initialized
const processFiles = require('./files.js');
const processHtml = require('./html/html.js');

module.exports = async function () {
	let filesChanged = 0;
	let htmlChanged = 0;

	// Process the export files
	// const filesChanged = await processFiles();
	// if(filesChanged != 0) console.log();

	// Run build
	htmlChanged = await processHtml();
	if(htmlChanged === false) return; // HTML Processing error
	else if(htmlChanged != 0) console.log();

	const changedCount = filesChanged + htmlChanged;
	if(changedCount === 0) colorLog(['yellow', 'BUILD :: Nothing to rebuild']);
	else colorLog(['yellow', 'BUILD :: Rebuilt '],
	['cyan', changedCount],
	['yellow', ' files\n']);
}