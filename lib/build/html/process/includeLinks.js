const includeLinks = {
	'html': require(__htmldev_root + '/lib/build/html/process/includes/html.js'),
	'js': require(__htmldev_root + '/lib/build/html/process/includes/javascript.js'),
	'css': require(__htmldev_root + '/lib/build/html/process/includes/css.js'),
	'scss': require(__htmldev_root + '/lib/build/html/process/includes/scss.js'),
	'ico': require(__htmldev_root + '/lib/build/html/process/includes/ico.js'),
	'svg': require(__htmldev_root + '/lib/build/html/process/includes/svg.js'),
};
const includeLinksPicture = require(__htmldev_root + '/lib/build/html/process/includes/picture.js');
includeLinks['png'] = includeLinksPicture;
includeLinks['jpg'] = includeLinksPicture;
includeLinks['jpeg'] = includeLinksPicture;

module.exports = includeLinks;