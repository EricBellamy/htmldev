const fs = require('fs-extra');

const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');
const readFile = require(__htmldev_root + '/lib/module/files/readFile.js');

module.exports = async function (FILE_PATH, EXPORT_FOLDER_BASE_PATH = 'export', shouldMinify = false) {
	const filetype = getFileType(FILE_PATH);
	const contents = await readFile(`${process.cwd()}/include/${filetype}/${FILE_PATH}`);

	// Get the base folder of the file being exported
	let FILE_PATH_FOLDER_BASE = '';
	if(FILE_PATH.indexOf('/') != -1) FILE_PATH_FOLDER_BASE = FILE_PATH.substring(0, FILE_PATH.lastIndexOf('/'));

	// Create the export file
	const exportFileFolderPath = `${process.cwd()}/.htmldev/dist/${EXPORT_FOLDER_BASE_PATH}/${filetype}`;
	const exportFilePath = `${exportFileFolderPath}/${FILE_PATH}`;
	fs.ensureDirSync(`${exportFileFolderPath}/${FILE_PATH_FOLDER_BASE}`);
	fs.writeFileSync(exportFilePath, contents);
}