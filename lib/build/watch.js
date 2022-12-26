// The nodemon command to replicate
// nodemon --ignore **/dist/** -e js,html,css compile.js

const nodemon = require('nodemon');

module.exports = function () {
	nodemon({
		scriptPosition: 0,
		ignore: ['**/dist/**'],
		ext: '*',
		script: __htmldev_root + '/lib/build/watchBuildFiles.js',
		args: []
	});
}