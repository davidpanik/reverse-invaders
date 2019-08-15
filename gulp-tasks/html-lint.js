module.exports = function (gulp, plugins, config, errorHandler) {
	var reload = plugins.browserSync.reload;

	gulp.task('html-lint', function() {
		var files = gulp.src(config.paths.output.html)
			.pipe(plugins.cached('html-lint'));

		if (config.linting === true) {
			return files
				.pipe(plugins.plumber(errorHandler))
				.pipe(plugins.htmllint({
					'rules': {
						'attr-name-ignore-regex': ':',
						'attr-name-style': 'dash',
						'attr-quote-style': 'double',
						'attr-no-dup': true,
						'class-no-dup': true,
						'doctype-first': true,
						'doctype-html5': true,
						'head-req-title': true,
						'html-req-lang': true,
						'id-class-style': 'dash',
						'id-no-dup': true,
						'img-req-alt': 'allownull',
						'img-req-src': true,
						'indent-style': 'tabs',
						'input-req-label': true,
						'line-end-style': false,
						'tag-close': true,
						'tag-name-lowercase': true,
						'title-no-dup': true
					},
					'failOnError': false
				}, htmllintReporter))
				.pipe(reload({ stream: true }));
		} else {
			return files;
		}
	});

	function htmllintReporter(filepath, issues) {
	    if (issues.length > 0) {
			console.log();
			console.log(plugins.util.colors.underline.white(filepath));

	        issues.forEach(function (issue) {
				console.log(plugins.util.colors.yellow(issue.line + ':' + issue.column + '     ' + issue.msg));
			});
			console.log();
	    }
	}
};
