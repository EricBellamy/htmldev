const validator = require('html-validator');

// Check if we're missing a wrapping body tag, validate the html
module.exports = async function (HTML_STRING) {
	const result = await validator({ data: HTML_STRING });
	const errors = [];
	for (const message of result.messages) {
		if (message.type === 'error') errors.push(`${message.message}\n`);
	}
	if (0 < errors.length) return errors;
	return true;
}