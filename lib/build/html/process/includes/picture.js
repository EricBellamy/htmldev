{/* <picture>
    <source media="(min-width: 45em)" srcset="large.jpg" />
    <source media="(min-width: 18em)" srcset="med.jpg" />
    <source src="small.jpg" />
    <img src="small.jpg" alt="Photo of a turboencabulator" loading="lazy" />
</picture> */}
module.exports = {
	process: function (template, node, contents) {
		console.log("image.js");
		node.replaceWith("");
	}
}