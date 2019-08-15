module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('babelify-develop', function() {
		var args = plugins.watchify.args;
		args.debug = true;

		var tasks = config.bundles.map((bundle) => {
			return plugins.watchify(plugins.browserify(config.paths.input.scripts + bundle + '.js', args))
			.transform(plugins.babelify, { presets: ['es2015'], compact: false })
			.bundle()
			.on('error', function(error) {
				error.plugin = 'babelify';
				errorHandler.call(this, error);
			})
			.pipe(plugins.vinylSourceStream(bundle + '.js'))
			.pipe(plugins.vinylBuffer())
			.pipe(gulp.dest(config.paths.output.scripts));
		});

		return plugins.eventStream.merge.apply(null, tasks);
	});
};
