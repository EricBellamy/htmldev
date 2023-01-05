const HTMLHint = require('htmlhint').HTMLHint;

// Check if we're missing a wrapping body tag, validate the html
module.exports = async function (HTML_STRING, FILE_PATH = "") {
	const messages = HTMLHint.verify(HTML_STRING);
	const errors = [];
	for (const message of messages) {
		console.log(message);
		if (message.type === 'error') {
			// rule.description ( evidence ) [ line : col ]
			errors.push([
				['red', `[HTML Validation] ${message.rule.description} ( `],
				['magenta', message.evidence],
				['red', ' ) ['],
				['magenta', message.line],
				['red', ':'],
				['magenta', message.col],
				['red', '] in file "'],
				['magenta', FILE_PATH],
				['red', '"'],
			]);
		}
	}
	if (0 < errors.length) return errors;
	return true;
}