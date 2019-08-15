module.exports = function (gulp, plugins, config, errorHandler) {
	//browser-sync task for starting the server.
	gulp.task('browser-sync', function() {
		//watch files
		var files = [
			//update this for all theme base file types
			config.paths.output.styles + '/*.css'
		];

		if (config.browserSync.useProxy) {
			plugins.browserSync.init(files, {
				proxy: config.browserSync.proxyUrl,
				notify: false
			});
		} else {
			//initialize browsersync
			plugins.browserSync.init(files, {
				server: {
					baseDir: config.paths.output.devRoot
				}
			});
		}
	});

	gulp.task('browser-reload', function() {
		//watch files
		plugins.browserSync.reload();
	});
};
