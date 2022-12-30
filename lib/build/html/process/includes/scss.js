module.exports = {
	load: true, // Loads the file before process
	process: function (template, node, contents) {
		console.log("scss.js");
		node.replaceWith("");
	}
}