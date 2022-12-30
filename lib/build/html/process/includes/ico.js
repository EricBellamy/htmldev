module.exports = {
	process: function (template, node, contents) {
		console.log("ico.js");
		node.replaceWith("");
	}
}