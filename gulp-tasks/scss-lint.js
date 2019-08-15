module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('scss-lint', function() {
		var files = gulp.src(config.lintedFiles)
			.pipe(plugins.cached('scss-lint'));

		if (config.linting === true) {
			return files
				.pipe(plugins.postcss([
					plugins.stylelint(),
					plugins.postcssReporter({ clearReportedMessages: true, throwError: false, noIcon: false, plugins: ['stylelint'] })
				], { syntax: plugins.postcssScss }));
		} else {
			return files;
		}
	});
};
