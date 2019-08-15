// This code lovingly stolen from gulp-prettyerror
// https://github.com/AndiDittrich/gulp-prettyerror/blob/master/gulp-prettyerror.js

var playSound = require('./play-sound');

module.exports = function (plugins, config) {
	return function (error) {
		if (config.sounds.active === true) {
			playSound(config.sounds.error);
		}

		// extract values and apply defaults
		var plugin = error.plugin || 'unknown';
		var message = error.message || 'unknown error';
		var codeFrame = error.codeFrame || null;
		var cause = error.cause || {};

		// detailed message given ? append it
		if (cause.message) {
			var file = cause.filename || 'unknown file';
			var line = cause.line || '0';
			var position = cause.position || '0';

			// generate detailed error message
			message = '[' + file + '] - ' + cause.message + ' (' + line + ':' + position + ')';
		}

		// log the error message
		plugins.util.log('|- ' + plugins.util.colors.bgRed.bold('Build Error in ' + plugin));
		plugins.util.log('|- ' + plugins.util.colors.bgRed.bold(message));

		// make sure there is codeFrame in the error object
		if (codeFrame) {
			// add indentation
			var msg = codeFrame.replace(/\n/g, '\n    ');

			plugins.util.log('|- ' + plugins.util.colors.bgRed('>>>'));
			plugins.util.log('|\n    ' + msg + '\n           |');
			plugins.util.log('|- ' + plugins.util.colors.bgRed('<<<'));

			// stacktrace available ?
		} else if (cause.stack) {
			// add indentation
			var stacktrace = cause.stack.replace(/^(\s*)/gm, '           | ');

			plugins.util.log('|- ' + plugins.util.colors.bgRed('>>>'));
			plugins.util.log('|\n' + stacktrace + '\n           |');
			plugins.util.log('|- ' + plugins.util.colors.bgRed('<<<'));
		}

		// make sure the process is finished
		this.emit('end');
	}
};