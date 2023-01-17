const fs = require('fs-extra');

const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');
const readFile = require(__htmldev_root + '/lib/module/files/readFile.js');

const includeLinks = require(__htmldev_root + '/lib/build/html/process/includeLinks.js');

module.exports = async function (FILE_PATH, EXPORT_FOLDER_BASE_PATH = 'export', shouldMinify = false) {
	let filetype = getFileType(FILE_PATH);
	const contents = await readFile(`${process.cwd()}/include/${filetype}/${FILE_PATH}`, shouldMinify);

	// Get the base folder of the file being exported
	let FILE_PATH_FOLDER_BASE = '';
	if(FILE_PATH.indexOf('/') != -1) FILE_PATH_FOLDER_BASE = FILE_PATH.substring(0, FILE_PATH.lastIndexOf('/'));

	// Check if the file type has an export path modifier
	if(includeLinks[filetype] && includeLinks[filetype].exportPath) {
		FILE_PATH = includeLinks[filetype].exportPath(FILE_PATH);
		filetype = getFileType(FILE_PATH);
	}

	// Create the export file
	const exportFileFolderPath = `${module.exports.EXPORT_FILE_BASE}/${EXPORT_FOLDER_BASE_PATH}/${filetype}`;
	fs.ensureDirSync(`${exportFileFolderPath}/${FILE_PATH_FOLDER_BASE}`);
	fs.writeFileSync(`${exportFileFolderPath}/${FILE_PATH}`, contents);
	return `${exportFileFolderPath}/${FILE_PATH}`;
}
module.exports.EXPORT_FILE_BASE = `${process.cwd()}/.htmldev/dist`;