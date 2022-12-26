const fs = require('fs-extra');

module.exports = async function (PORT_NUMBER, EMPTY = false) {
	fs.ensureDirSync('dist');
	if (EMPTY) fs.emptyDirSync('dist');

	// Initialize watcher
	require('../lib/build/watch.js')();

	// Host HTTP server
	require('../lib/server.js')(PORT_NUMBER);
}