module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('sass-develop', function() {
		return gulp.src(config.paths.input.styles)
			.pipe(plugins.plumber(errorHandler))
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.sass())
			.pipe(plugins.sourcemaps.write())
			.pipe(gulp.dest(config.paths.output.styles));
	});
};
