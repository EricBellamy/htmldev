module.exports = {
	process: async function (template, node, contents) {
		console.log("ico.js");
		node.replaceWith("");
	}
}