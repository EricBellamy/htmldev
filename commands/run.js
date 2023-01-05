const fs = require('fs-extra');
const buildFiles = require(__htmldev_root + '/lib/build/buildFiles.js');

module.exports = async function (PORT_NUMBER, EMPTY = true) {
	fs.ensureDirSync('dist');
	if (EMPTY) fs.emptyDirSync('dist');

	// Run an initial build so lightserver can latch on
	await buildFiles();

	// Initialize watcher, runs build once on start
	require('../lib/build/watch.js')();

	// Host HTTP light-server (Hot reload)
	require('../lib/lightserver.js')();
}