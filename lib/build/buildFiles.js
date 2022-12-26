// Require files after global is initialized
const processFiles = require('./files.js');
const processHtml = require('./html/html.js');

module.exports = async function () {
	// Process the export files
	const filesChanged = await processFiles();

	// Run build
	const htmlChanged = await processHtml();

	const changedCount = filesChanged + htmlChanged;
	if(changedCount === 0) console.log("BUILD :: Nothing to rebuild.");
	else console.log(`BUILD :: Rebuilt ${changedCount} files.\n`);
}