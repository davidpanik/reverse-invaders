module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('clean', function() {
		//clean all files
		return gulp
			.src(config.paths.output.devRoot)
			.pipe(plugins.clean());
	});
};
