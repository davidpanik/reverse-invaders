module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('es-lint', function() {
        var files = gulp.src([config.paths.input.scripts + '**/*.js', '!' + config.paths.input.scripts + 'vendor/**/*.js'])
            .pipe(plugins.cached('es-lint'));

        if (config.linting === true) {
            return files
                .pipe(plugins.eslint())    
                .pipe(plugins.eslint.format());
        } else {
            return files;
        }
	});
};
