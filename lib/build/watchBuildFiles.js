// Initialize the htmldev root if we need to
if(global.__htmldev_root === undefined) global.__htmldev_root = __dirname + "/../..";

// Require files after global is initialized
const buildFiles = require('./buildFiles.js');
buildFiles();