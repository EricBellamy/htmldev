const fs = require('fs-extra');

module.exports = async function (PORT_NUMBER, EMPTY = true) {
	fs.ensureDirSync('dist');
	if (EMPTY) fs.emptyDirSync('dist');

	// Initialize watcher, runs build once on start
	require('../lib/build/watch.js')();

	// Host HTTP light-server (Hot reload)
	require('../lib/lightserver.js')();
}