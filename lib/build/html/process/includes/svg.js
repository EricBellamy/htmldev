module.exports = {
	load: true, // Loads the file before process
	process: async function (template, node, contents) {
		console.log("svg.js");
		node.replaceWith("");
	}
}