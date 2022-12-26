const httpServer = require('http-server');
const colors = require('colors/safe');
const os = require('os');
const ifaces = os.networkInterfaces();

module.exports = function (port, host = '0.0.0.0') {
	const WORKING_DIRECTORY = process.cwd();

	const server = httpServer.createServer({
		logFn: function (req, res, error) {
			if (error) {
				console.log(
					'[%s] "%s %s" Error (%s): "%s"',
					new Date(), colors.red(req.method), colors.red(req.url),
					colors.red(error.status.toString()), colors.red(error.message)
				);
			} else {
				console.log(
					'[%s] "%s %s" "%s"',
					new Date(), colors.cyan(req.method), colors.cyan(req.url),
					req.headers['user-agent']
				);
			}
		},
		cors: true,
		root: "./dist"
	});

	server.listen(port, host, function () {
		var canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host,
			protocol = 'http://';

		console.log([colors.yellow('Starting up http-server, serving '),
		colors.cyan(server.root),
		colors.yellow('\nAvailable on:')
		].join(''));

		Object.keys(ifaces).forEach(function (dev) {
			ifaces[dev].forEach(function (details) {
				if (details.family === 'IPv4') {
					console.log(('  ' + protocol + details.address + ':' + colors.green(port.toString())));
				}
			});
		});

		if (typeof proxy === 'string') {
			console.log('Unhandled requests will be served from: ' + proxy);
		}

		console.log('Hit CTRL-C to stop the server');
	});
}