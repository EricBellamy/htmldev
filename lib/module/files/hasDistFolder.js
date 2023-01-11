const getFileType = require(__htmldev_root + '/lib/module/files/getFileType.js');
module.exports.include = function (path) {
	const fileType = getFileType(path);
	// Process the includes
	switch (fileType) {
		case 'html':
		// Load template HTML
		case 'js':
		// Inline by default
		// Support "lazy" attribute
		case 'css':
		// Inline by default
		// Support "lazy" attribute
		case 'scss':
		// Inline by default
		// Support "lazy" attribute
		case 'ico':
		// Lazy load by default
		case 'png':
		case 'jpg':
		case 'jpeg':
		// Picture element & lazy by default
		case 'svg':
			return true;
	}
	return false;
}