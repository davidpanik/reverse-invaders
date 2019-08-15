var gulp = require('gulp');
var config = require('./config.json');
var plugins = require('gulp-load-plugins')({
	pattern: '*'
});
var errorHandler = require('./gulp-tasks/error')(plugins, config);


// Clean
require('./gulp-tasks/clean')(gulp, plugins, config, errorHandler);
require('./gulp-tasks/clean-release')(gulp, plugins, config, errorHandler);

// Copy
require('./gulp-tasks/copy-dev')(gulp, plugins, config, errorHandler);
require('./gulp-tasks/copy-build')(gulp, plugins, config, errorHandler);
require('./gulp-tasks/copy-release')(gulp, plugins, config, errorHandler);

// SCSS
require('./gulp-tasks/scss-lint')(gulp, plugins, config, errorHandler);

require('./gulp-tasks/sass-develop')(gulp, plugins, config, errorHandler);
require('./gulp-tasks/sass-build')(gulp, plugins, config, errorHandler);

// ES6
require('./gulp-tasks/babelify-develop')(gulp, plugins, config, errorHandler);
require('./gulp-tasks/babelify-build')(gulp, plugins, config, errorHandler);

// JavaScript linting
require('./gulp-tasks/es-lint')(gulp, plugins, config, errorHandler);

// Image minification
require('./gulp-tasks/image-min')(gulp, plugins, config, errorHandler);

// HTML templating
require('./gulp-tasks/html-templating')(gulp, plugins, config, errorHandler);

// HTML standards
require('./gulp-tasks/html-lint')(gulp, plugins, config, errorHandler);

// BrowserSync
require('./gulp-tasks/browser-sync')(gulp, plugins, config, errorHandler);

// Watch
require('./gulp-tasks/watch')(gulp, plugins, config, errorHandler);

// Complete
require('./gulp-tasks/complete')(gulp, plugins, config, errorHandler);

// Zip
require('./gulp-tasks/zip')(gulp, plugins, config, errorHandler);


gulp.task('develop', function(callback) {
	plugins.runSequence('clean', 'copy-dev', ['scss-lint', 'sass-develop', 'babelify-develop', 'es-lint', 'html-templating-develop'], 'html-lint', 'browser-sync', 'watch', 'complete', callback);
});

gulp.task('build', function(callback) {
	plugins.runSequence('clean', 'copy-build', ['scss-lint', 'sass-build', 'babelify-build', 'es-lint', 'html-templating-build'], 'image-min-reminder', 'zip', 'complete', callback);
});

gulp.task('release', function(callback) {
	plugins.runSequence('clean-release', 'copy-release', 'complete', callback);
});

gulp.task('default', ['develop']);
