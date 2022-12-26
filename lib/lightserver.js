// light-server -s dist -w dist/*.html
const LightServer = require('light-server');

module.exports = async function () {
	const server = new LightServer({
		port: 4000,
		interval: 500,
		delay: 0,
		bind: undefined,
		proxypaths: ['/'],
		watchexps: ['dist/*.html'],
		serve: 'dist'
	});
	server.start();
}