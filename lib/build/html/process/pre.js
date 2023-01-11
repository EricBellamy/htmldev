const HTMLParser = require('node-html-parser');

const colorLog = require(__htmldev_root + '/lib/module/logs/colorLog.js');

// Check if we're missing a wrapping body tag, validate the html
module.exports = async function (parsed, FILE_PATH) {
	let filename = FILE_PATH.substring(FILE_PATH.lastIndexOf('/') + 1);
	filename = filename.split('.')[0];

	// Fix missing <html> tag
	if (parsed.querySelector('html') === null) {
		const wrappingBody = HTMLParser.parse('<!DOCTYPE html><html></html>');
		wrappingBody.querySelector('html').appendChild(parsed);
		parsed = wrappingBody;

		colorLog(['yellow', '[PROCESS/PRE] Fixed missing <html> tag for "'],
			['cyan', FILE_PATH],
			['yellow', '"']);
	}

	// Fix nested DOCTYPE in fixed <html> tag
	if (parsed.querySelector('html').innerHTML.indexOf('<!DOCTYPE html>') === 0) {
		parsed.querySelector('html').innerHTML = parsed.querySelector('html').innerHTML.substring('<!DOCTYPE html>'.length);

		colorLog(['yellow', '[PROCESS/PRE] Fixed missing <!DOCTYPE html> tag for "'],
			['cyan', FILE_PATH],
			['yellow', '"']);
	}

	const parsedHtmlTag = parsed.querySelector('html');
	// Fix missing <head> tag
	if (parsedHtmlTag.querySelector('head') === null) {
		parsedHtmlTag.insertAdjacentHTML('afterbegin', `<head><title>${filename}</title></head>`);

		colorLog(['yellow', '[PROCESS/PRE] Fixed missing <head> tag for "'],
			['cyan', FILE_PATH],
			['yellow', '"']);
	}

	// Fix missing title tag inside of <head>
	if (parsedHtmlTag.querySelector('head title') === null) {
		parsedHtmlTag.querySelector('head').insertAdjacentHTML('afterbegin', `<title>${filename}</title>`);
		colorLog(['yellow', '[PROCESS/PRE] Fixed missing <title> tag for "'],
			['cyan', FILE_PATH],
			['yellow', '"']);
	}

	// Fix missing <body> tag
	if (parsed.querySelector('body') === null) {
		const newBodyTag = HTMLParser.parse('<body></body>');
		for (const childNode of parsedHtmlTag.childNodes) {
			if (childNode.rawTagName != 'head') {
				childNode.parentNode.removeChild();
				newBodyTag.querySelector('body').appendChild(childNode);
			}
		}
		parsedHtmlTag.appendChild(newBodyTag);

		colorLog(['yellow', '[PROCESS/PRE] Fixed missing <body> tag for "'],
			['cyan', FILE_PATH],
			['yellow', '"']);
	}

	return parsed;
}