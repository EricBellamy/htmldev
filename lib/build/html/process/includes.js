const fs = require('fs-extra');
const HTMLParser = require('node-html-parser');

module.exports = function(HTML_STRING, FILE_PATH){
	const parsedTemplate = HTMLParser.parse(HTML_STRING);
	parsedTemplate.removeWhitespace();

	// While loop that checks if we have include tags
	// Continuously loads them & their data
	let includeNodes = parsedTemplate.querySelectorAll('include');
	console.log(includeNodes);

	console.log("IN THE INCLUDES FILE");
	console.log(HTML_STRING)
	return HTML_STRING;
}