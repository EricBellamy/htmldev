const fs = require('fs-extra');
const buildFiles = require(__htmldev_root + '/lib/build/buildFiles.js');

module.exports = async function (PORT_NUMBER, EMPTY = true) {
	if (EMPTY) fs.emptyDirSync('.htmldev');
	fs.ensureDirSync('.htmldev/dist');

	// Run an initial build so lightserver can latch on
	await buildFiles();

	// Initialize watcher, runs build once on start
	require('../lib/build/watch.js')();

	// Host HTTP light-server (Hot reload)
	require('../lib/lightserver.js')(PORT_NUMBER);
}

// Remove the need for 2x [ ctrl + c ]
process.on('SIGINT', function () { process.exit(); });