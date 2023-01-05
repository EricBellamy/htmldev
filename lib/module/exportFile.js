const fs = require('fs-extra');
const path = require('path');
const includeLinks = {
	'.html': require(__htmldev_root + '/lib/build/html/process/includes/html.js'),
	'.js': require(__htmldev_root + '/lib/build/html/process/includes/javascript.js'),
	'.css': require(__htmldev_root + '/lib/build/html/process/includes/css.js'),
	'.scss': require(__htmldev_root + '/lib/build/html/process/includes/scss.js'),
	'.ico': require(__htmldev_root + '/lib/build/html/process/includes/ico.js'),
	'.svg': require(__htmldev_root + '/lib/build/html/process/includes/svg.js'),
};

module.exports = async function (FILE_PATH, EXPORT_FOLDER_BASE_PATH = 'export', shouldMinify = false) {
	// Check if the file type has a minification process
	// Minify the file & export
	const ext = path.extname(FILE_PATH);
	const noDotExt = ext.substring(1);
	const filePath = `${process.cwd()}/include/${noDotExt}/${FILE_PATH}`;

	console.log(ext, noDotExt, filePath, shouldMinify);

	// Get the file contents & minify if needed
	let contents = fs.readFileSync(filePath, 'utf8');
	const targetIncludeLink = includeLinks[ext];
	if(shouldMinify && targetIncludeLink.minify) contents = await targetIncludeLink.minify(contents);

	// Get the base folder of the file being exported
	let FILE_PATH_FOLDER_BASE = '';
	if(FILE_PATH.indexOf('/') != -1) FILE_PATH_FOLDER_BASE = FILE_PATH.substring(0, FILE_PATH.lastIndexOf('/'));

	// Create the export file
	const exportFileFolderPath = `${process.cwd()}/dist/${EXPORT_FOLDER_BASE_PATH}/${noDotExt}`;
	const exportFilePath = `${exportFileFolderPath}/${FILE_PATH}`;
	fs.ensureDirSync(`${exportFileFolderPath}/${FILE_PATH_FOLDER_BASE}`);
	fs.writeFileSync(exportFilePath, contents);
}