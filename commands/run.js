const fs = require('fs-extra');

// Local
const processFiles = require('../lib/build/files.js');
const processHtml = require('../lib/build/html/html.js');

module.exports = async function (PORT_NUMBER, EMPTY = true) {
	fs.ensureDirSync('dist');
	if (EMPTY) fs.emptyDirSync('dist');

	// Process the export files
	await processFiles();

	// Run build
	await processHtml();

	// Host HTTP server
	require('../lib/server.js')(PORT_NUMBER);

	// Initialize watcher
}