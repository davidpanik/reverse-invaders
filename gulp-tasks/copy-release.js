module.exports = function (gulp, plugins, config, errorHandler) {
    gulp.task('copy-release', function() {
        //copy all files
		gulp.src(config.paths.output.devRoot + '/**/*', { nodir: true })
        .pipe(plugins.plumber(errorHandler))
        .pipe(gulp.dest(config.paths.output.release));
    });
};
