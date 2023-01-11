const fs = require('fs-extra');
const path = require('path');
function READ_DIRS(CURRENT_PATH, IGNORE = [], SEARCH_FOLDERS = true, FILES = {}) {
	try {
		const items = fs.readdirSync(CURRENT_PATH);
		for (const item of items) {
			if (IGNORE.indexOf(item) === -1) {
				const ITEM_PATH = path.join(CURRENT_PATH, item);
				const stat = fs.statSync(ITEM_PATH);
				if (stat.isDirectory()) {
					FILES[ITEM_PATH] = {
						modified: stat.mtimeMs,
					}
					if (SEARCH_FOLDERS) READ_DIRS(ITEM_PATH, IGNORE, SEARCH_FOLDERS, FILES);
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
	return FILES;
}

module.exports = READ_DIRS;