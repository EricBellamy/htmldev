const fs = require('fs-extra');
const { minify } = require("terser");

module.exports = async function (FILE_PATH, minifyFile = false) {
	let contents = fs.readFileSync(FILE_PATH, 'utf8');
	if (minifyFile) contents = (await minify(contents)).code;
	return contents;
}