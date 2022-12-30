module.exports = {
	load: true, // Loads the file before process
	process: function (template, node, contents) {
		// const result = await minify(contents);

		console.log("javascript.js");
		node.replaceWith("");
	}
}