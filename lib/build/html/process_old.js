const fs = require('fs-extra');
const HTMLParser = require('node-html-parser');

const includes = require('./includes_old.js');

function renderDataIntoHtml(HTML_STRING, data) {
	let HTML_COPY = HTML_STRING;
	// Replace all regex matches
	while (true) {
		const regex = /{{([^{]*)}}/;
		const match = HTML_COPY.match(regex);
		if (match) {
			try {
				// Grab the parts
				const matchContents = match[1];
				const beforeMatch = HTML_COPY.substring(0, match.index);
				const afterMatch = HTML_COPY.substring(match.index + match[0].length);

				// Replace the match with data or nothing
				if (data[matchContents]) {
					HTML_COPY = beforeMatch + data[matchContents] + afterMatch;
				} else HTML_COPY = beforeMatch + afterMatch;
			} catch (err) {
				console.error(err);
				return HTML_STRING;
			}
		} else break;
	}
	return HTML_COPY;
}

async function processIncludeTags(HTML_STRING, OUTPUT) {
	const parsedTemplate = HTMLParser.parse(HTML_STRING);
	parsedTemplate.removeWhitespace();

	// Include all files into the HTML
	const includeNodes = parsedTemplate.querySelectorAll('include');
	if (0 < includeNodes.length) {
		for (const includeNode of includeNodes) {
			const src = includeNode.getAttribute('src');
			const includeResults = await includes.load(src);

			let processedIncludeContents;
			if (includeResults) {
				// Log the modified time
				OUTPUT.updated[src] = includeResults[1];
				__currentbuild.updated[src] = includeResults[1];

				// Recursive, treats an includes as if it was a top level HTML file. Render, then process nested includes.
				processedIncludeContents = await renderAndProcessHtml(includeResults[0], includeNode.attributes, OUTPUT);
			} else processedIncludeContents = "";

			// Replace the tag in the HTML with the loaded file contents
			includeNode.replaceWith(processedIncludeContents);
		}
	}
	return parsedTemplate.toString();
}

async function renderAndProcessHtml(HTML_STRING, DATA, OUTPUT) {
	// Render the data
	const renderedHtml = renderDataIntoHtml(HTML_STRING, DATA);

	// Load the includes
	// Repeat same steps for each include
	return await processIncludeTags(renderedHtml, OUTPUT);
}

module.exports = {
	load: async function (DATA, FILE_PATH) {
		// Load the file contents
		const html = fs.readFileSync(FILE_PATH, 'utf8');
		const stats = fs.statSync(FILE_PATH);

		const OUTPUT = {
			updated: {}
		};
		OUTPUT.updated[FILE_PATH] = stats.mtimeMs;
		__currentbuild.updated[FILE_PATH] = stats.mtimeMs;

		const processedHtml = await renderAndProcessHtml(html, DATA, OUTPUT);

		OUTPUT.html = processedHtml
		return OUTPUT; // html, modified
	}
}