var childProcess = require('child_process');

module.exports = function (sound) {
	if (sound && sound !== '') {
		childProcess.exec('cmdmp3.exe ' + sound, { cwd: process.cwd() + '\\gulp-tasks' });
	}
};