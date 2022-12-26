// Builds 

const fs = require('fs-extra');
const webp = require('webp-converter');

const { minify } = require("terser");
const CleanCSS = require('clean-css');
const minifyCSS = new CleanCSS();

const readDirFiles = require(`${__htmldev_root}/lib/module/readDirFiles.js`);

async function processFile(file, options) {
	switch (file.type) {
		case 'png':
			await webp.cwebp(file.FILE_PATH, `${file.NO_FILE_TYPE_DIST_PATH}.webp`, "-q 80", logging = "-v");
			fs.copyFileSync(file.FILE_PATH, file.NO_FILE_TYPE_DIST_PATH + "." + file.type);
			break;
		case "js":
			const jsContents = fs.readFileSync(file.FILE_PATH, 'utf8');

			try {
				const jsResult = await minify(jsContents);
				fs.writeFileSync(`${file.NO_FILE_TYPE_DIST_PATH}.min.js`, jsResult.code);
			} catch (err) { }
			fs.writeFileSync(`${file.NO_FILE_TYPE_DIST_PATH}.js`, jsContents);
			break;
		case "css":
			const cssContents = fs.readFileSync(file.FILE_PATH, 'utf8');

			try {
				const cssResult = minifyCSS.minify(cssContents);
				fs.writeFileSync(`${file.NO_FILE_TYPE_DIST_PATH}.min.css`, cssResult.styles);
			} catch (err) { }
			fs.writeFileSync(`${file.NO_FILE_TYPE_DIST_PATH}.min.css`, cssContents);
			break;
		default:
			// Copy all other files
			fs.copyFileSync(file.FILE_PATH, file.NO_FILE_TYPE_DIST_PATH + "." + file.type);
			break;
	}
}

function isNotInLastBuild(LAST_BUILD, file, file_key){
	const LAST_BUILD_FILE = LAST_BUILD[file_key];
	return LAST_BUILD_FILE === undefined || LAST_BUILD_FILE.modified != file.modified;
}

module.exports = async function (options = {}) {
	const EXPORT_PATH = process.cwd() + "/export";
	const files = readDirFiles(EXPORT_PATH, ['.DS_Store'], true, "");

	let LAST_BUILD;
	try { LAST_BUILD = JSON.parse(fs.readFileSync('dist/build_export.json')); }
	catch (err) { LAST_BUILD = {}; }

	let CHANGED_COUNT = 0;

	// Process images
	for (const FILE_KEY in files) {
		const file = files[FILE_KEY];

		// Check if the file has been modified since last build
		if (isNotInLastBuild(LAST_BUILD, file, FILE_KEY)) {
			file.FILE_PATH = `${EXPORT_PATH}${FILE_KEY}`; // The input path of the target file
			file.NO_FILE_TYPE_DIST_PATH = process.cwd() + "/dist/export" + FILE_KEY.substring(0, FILE_KEY.lastIndexOf('.')); // The path of the file with no file ending ( 'test.js' = 'test' )
			file.DIST_FOLDER = process.cwd() + "/dist/export" + FILE_KEY.substring(0, FILE_KEY.lastIndexOf("/")); // The directory path of the target file

			// Ensure the output directory
			fs.ensureDirSync(file.DIST_FOLDER);

			console.log(`FILES :: Building ${file.FILE_PATH}`);

			CHANGED_COUNT++;

			await processFile(file, options);
		}
	}

	fs.writeFileSync('dist/build_export.json', JSON.stringify(files));

	return CHANGED_COUNT;
}