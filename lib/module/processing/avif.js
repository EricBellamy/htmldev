const sharp = require("sharp");

module.exports = async function (IN_PATH, OUT_PATH) {
	// effort = 4 / 9 (slowest)
	await sharp(IN_PATH)
		.avif({ quality: 80, effort: 0, nearLossless: true })
		.toFile(OUT_PATH);
}