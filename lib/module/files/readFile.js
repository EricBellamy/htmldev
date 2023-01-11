const fs = require('fs-extra');
const path = require('path');
const includeLinks = {
	'html': require(__htmldev_root + '/lib/build/html/process/includes/html.js'),
	'js': require(__htmldev_root + '/lib/build/html/process/includes/javascript.js'),
	'css': require(__htmldev_root + '/lib/build/html/process/includes/css.js'),
	'scss': require(__htmldev_root + '/lib/build/html/process/includes/scss.js'),
	'ico': require(__htmldev_root + '/lib/build/html/process/includes/ico.js'),
	'svg': require(__htmldev_root + '/lib/build/html/process/includes/svg.js'),
};
const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');

module.exports = async function (FILE_PATH, shouldMinify = false) {
	const filetype = getFileType(FILE_PATH);

	// Get the file contents & minify if needed
	let contents = fs.readFileSync(FILE_PATH, 'utf8');
	if (shouldMinify && includeLinks[filetype].minify) contents = await includeLinks[filetype].minify(contents);

	return contents;
}