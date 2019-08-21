import TinyMusic from './vendor/TinyMusic';

export default function createAudio() {
	let audio = {
		enabled: false,
		sounds: {},
		audioContext: null,

		init: function () {
			this.audioContext = new AudioContext();

			document.addEventListener('click', () => {
				console.log('clicked', this.enabled);
				this.enabled = !this.enabled;
			});
		},

		add: function (name, tempo, notes) {
			let sequence = new TinyMusic.Sequence(this.audioContext, tempo, notes);

			sequence.gain.gain.value = 0.1;
			sequence.bass.gain.value = 40;
			sequence.createCustomWave([-1, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1]);
			sequence.loop = false;

			this.sounds[name] = sequence;
		},

		play: function (name) {
			if (this.enabled && this.sounds[name]) {
				this.sounds[name].play();
			}
		}
	};

	audio.add('playerShoot', 200, ['G3 s']);
	audio.add('alienShoot', 200, ['C3 s']);

	audio.init();

	return audio;
}
