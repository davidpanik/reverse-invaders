module.exports = function (gulp, plugins, config, errorHandler) {
	var combined = {};
	var task = '';
	
	gulp.task('html-templating-develop', function (callback) {
		task = 'develop';
		plugins.runSequence('merge-data', 'compile-handlebars', callback);
	});

	gulp.task('html-templating-build', function (callback) {
		task = 'build';
		plugins.runSequence('merge-data', 'compile-handlebars', callback);
	});

	gulp.task('merge-data', function (callback) {
		gulp.src(config.paths.input.data)
			.pipe(plugins.mergeJson({
				endObj: {
					'context': {
						'task': task
					}
				}
			}))
			.on('data', (output) => { combined = JSON.parse(output.contents.toString()); })
			.on('end', callback);
	});

	gulp.task('compile-handlebars', function () {
		gulp.src(config.paths.input.html)
			.pipe(plugins.nunjucks.compile(combined))
			.pipe(gulp.dest(config.paths.output.devRoot));
	});
};
