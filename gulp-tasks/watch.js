module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('watch', function() {
		gulp.watch(config.paths.input.static,  ['copy-dev']);
		gulp.watch(config.paths.input.styles, ['scss-lint', 'sass-develop']);
		gulp.watch(config.paths.input.spriteSrc, ['sprite-create']);
		gulp.watch(config.paths.input.scripts + '**/*.js', function () {
			plugins.runSequence(['es-lint', 'babelify-develop'], 'browser-reload');
		});
		gulp.watch(config.paths.input.data, function () {
			plugins.runSequence('html-templating-develop', 'browser-reload');
		});
		gulp.watch(config.paths.input.htmlWatch, function () {
			plugins.runSequence('html-templating-develop', 'html-lint', 'browser-reload');
		});
	});
};
