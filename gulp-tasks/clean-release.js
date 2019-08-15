module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('clean-release', function() {
		//clean all files
		return gulp
			.src(config.paths.output.release)
			.pipe(plugins.clean());
	});
};
