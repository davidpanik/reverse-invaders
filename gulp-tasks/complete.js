var playSound = require('./play-sound');

module.exports = function (gulp, plugins, config, errorHandler) {
	gulp.task('complete', function() {
		if (config.sounds.active === true) {
			playSound(config.sounds.success);
		}
	});
};
