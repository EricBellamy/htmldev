const fs = require('fs-extra');

const { minify } = require("terser");
const CleanCSS = require('clean-css');
const minifyCSS = new CleanCSS();

// Handles compressing all include files
// Loads & Minifies all files in includes folders at runtime

const LOADED_FILES = {};

const LOAD_SCRIPTS = {
	css: async function (FILE_PATH) {
		if (LOADED_FILES[FILE_PATH]) return LOADED_FILES[FILE_PATH];

		const filePath = `${process.cwd()}/include/css/${FILE_PATH}`;
		const contents = fs.readFileSync(filePath, 'utf8');
		const output = minifyCSS.minify(contents);
		const stats = fs.statSync(filePath);

		LOADED_FILES[FILE_PATH] = [`<style>${output.styles}</style>`, stats.mtimeMs];
		return LOADED_FILES[FILE_PATH];
	},
	js: async function (FILE_PATH) {
		if (LOADED_FILES[FILE_PATH]) return LOADED_FILES[FILE_PATH];

		const filePath = `${process.cwd()}/include/js/${FILE_PATH}`;
		const contents = fs.readFileSync(filePath, 'utf8');
		const result = await minify(contents);
		const stats = fs.statSync(filePath);

		// Minified
		// LOADED_FILES[FILE_PATH] = [`<script>${result.code}</script>`, stats.mtimeMs];
		// Non-Minified
		LOADED_FILES[FILE_PATH] = [`<script>${contents}</script>`, stats.mtimeMs];
		return LOADED_FILES[FILE_PATH];
	},
	html: async function(FILE_PATH){
		if (LOADED_FILES[FILE_PATH]) return LOADED_FILES[FILE_PATH];

		const filePath = `${process.cwd()}/include/html/${FILE_PATH}`;
		const contents = fs.readFileSync(filePath, 'utf8');
		const stats = fs.statSync(filePath);
		
		LOADED_FILES[FILE_PATH] = [contents, stats.mtimeMs];
		return LOADED_FILES[FILE_PATH];
	},
	svg: async function(FILE_PATH){
		const filePath = `${process.cwd()}/include/svg/${FILE_PATH}`;
		const contents = fs.readFileSync(filePath, 'utf8');
		const stats = fs.statSync(filePath);

		LOADED_FILES[FILE_PATH] = [contents, stats.mtimeMs];

		return LOADED_FILES[FILE_PATH];
	}
};

module.exports = {
	load: async function (FILE_PATH, ATTRIBUTES) {;
		// Check if FILE_PATH is CSS or JS
		const filetype = FILE_PATH.substring(FILE_PATH.lastIndexOf('.') + 1);
		if(LOAD_SCRIPTS[filetype]) return await LOAD_SCRIPTS[filetype](FILE_PATH);
		else return false;
	}
}