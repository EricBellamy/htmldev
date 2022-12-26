#!/usr/bin/env node
global.__htmldev_root = __dirname + "/..";

const arguments = process.argv.splice(2);
if (arguments[0] === undefined) arguments.push("help");

const commands = [
	["htmldev {PORT}", "hosts an HTTP server & build process that watches for changes"],
	["htmldev init", "registers this folder for automatic updates"],
	["htmldev list", "lists the active HTML repos"],
	["htmldev rm {PATH}", "removes the folder from automatic updates"],
	["htmldev update", "updates helper code & deploys all initialized folders"],
	["htmldev deploy", "deploys the current folder"],
];

switch (arguments[0]) {
	case "help":
		// Get the max length of command
		let maxLength = 0;
		for (const command of commands) if (maxLength < command[0].length) maxLength = command[0].length;

		console.log("htmldev <command>\n")
		console.log("Usage:\n");

		// Pad command strings to same length & print
		for (const command of commands) {
			for (let a = command[0].length; a < maxLength + 2; a++) command[0] += " ";
			console.log(command[0] + command[1]);
		}
		break;
	// htmldev {PORT}
	default:
		const PORT_NUMBER = parseInt(arguments[0]);

		// Run the HTTP server with the valid port
		if (Number.isInteger(PORT_NUMBER)) {
			require('../commands/run.js')(PORT_NUMBER);
		}
		break;
}