module.exports = {
	load: true, // Loads the file before process
	process: function (template, node, contents) {
		console.log("css.js");
		node.replaceWith("");
	}
}