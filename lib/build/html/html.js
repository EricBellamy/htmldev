const fs = require('fs-extra');
const readDirFiles = require(`${__htmldev_root}/lib/module/readDirFiles.js`);
const processHTML = require('./process.js');

const colorLog = require(__htmldev_root + '/lib/module/colorLog.js');

function isNotInLastBuild(LAST_BUILD, file, file_key) {
	const LAST_BUILD_FILE = LAST_BUILD[file_key];
	return LAST_BUILD_FILE === undefined || LAST_BUILD_FILE.modified != file.modified;
}

module.exports = async function () {
	global.__currentbuild = { updated: {} };
	__currentbuild.created_at = new Date().getTime();

	let LAST_BUILD;
	try { LAST_BUILD = JSON.parse(fs.readFileSync('dist/build_html.json')); }
	catch (err) { LAST_BUILD = {}; }

	// Read directory files
	const rootFiles = readDirFiles(process.cwd(), ['.DS_Store', '.git', 'node_modules'], false);
	const pageFiles = readDirFiles(process.cwd() + '/pages', ['.DS_Store', '.git', 'node_modules']);

	let CHANGED_COUNT = 0;

	let HTML_PROCESS_ERROR = false;

	// Process HTML page files
	for (const FILE_KEY in pageFiles) {
		const file = pageFiles[FILE_KEY];
		if (file.type === 'html' && isNotInLastBuild(LAST_BUILD, file, FILE_KEY)) {
			colorLog(['yellow', '[HTML] Building "'],
				['cyan', FILE_KEY.substring(process.cwd().length)],
				['yellow', '"']);
			CHANGED_COUNT++;
			const LOADED_FILE = await processHTML.load(FILE_KEY, {});
			if (LOADED_FILE === false) {
				HTML_PROCESS_ERROR = true;
				break;
			}

			const FILE_KEY_PARTS = FILE_KEY.split(process.cwd() + "/pages/");
			fs.writeFileSync(`dist/${FILE_KEY_PARTS[1]}`, LOADED_FILE.html);

			break;
		}
	}
	if (HTML_PROCESS_ERROR) return false;

	// Process root level HTML files
	// for (const FILE_KEY in rootFiles) {
	// 	const file = rootFiles[FILE_KEY];
	// 	if (file.type === 'html' && isNotInLastBuild(LAST_BUILD, file, FILE_KEY)) {
	// 		colorLog(['yellow', '[HTML] Building "'],
	// 			['cyan', FILE_KEY.substring(process.cwd().length)],
	// 			['yellow', '"']);
	// 		CHANGED_COUNT++;
	// 		const LOADED_FILE = await processHTML.load(FILE_KEY, {});
	// 		if (LOADED_FILE === false) {
	// 			HTML_PROCESS_ERROR = true;
	// 			break;
	// 		}
	// 		const FILE_KEY_PARTS = FILE_KEY.split(process.cwd() + "/");

	// 		fs.writeFileSync(`dist/${FILE_KEY_PARTS[1]}`, LOADED_FILE.html);
	// 	}
	// }
	// if (HTML_PROCESS_ERROR) return false;

	const files = { ...pageFiles, ...rootFiles };
	fs.writeFileSync('dist/build_html.json', JSON.stringify(files));

	return CHANGED_COUNT;
};