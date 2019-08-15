module.exports = function (gulp, plugins, config, errorHandler) {
    gulp.task('copy-build', function() {
        //copy static files
        gulp.src(config.paths.input.static, { nodir: true })
        .pipe(plugins.plumber(errorHandler))
        .pipe(gulp.dest(config.paths.output.devRoot));
    });
};
