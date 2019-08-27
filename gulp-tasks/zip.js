module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('zip', function() {
		gulp.src(config.paths.output.devRoot + '/**/*')
			.pipe(plugins.zip('archive.zip'))
			.pipe(plugins.size())
			.pipe(gulp.dest(config.paths.output.devRoot))
	});
};
