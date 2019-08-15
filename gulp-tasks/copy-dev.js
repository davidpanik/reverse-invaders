module.exports = function (gulp, plugins, config, errorHandler) {
    gulp.task('copy-dev', function() {
        //copy static files
        gulp.src(config.paths.input.static, { nodir: true })
        .pipe(plugins.cached('copy-dev'))
        .pipe(plugins.plumber(errorHandler))
        .pipe(gulp.dest(config.paths.output.devRoot));
    });
};
