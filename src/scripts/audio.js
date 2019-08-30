import TinyMusic from './vendor/TinyMusic';

class Audio {
	constructor() {
		this.enabled = false;
		this.sounds = {};
		this.audioContext = new AudioContext();

		document.addEventListener('click', () => {
			console.log('clicked', this.enabled);
			this.enabled = !this.enabled;
		});
	}

	add(name, tempo, notes) {
		let sequence = new TinyMusic.Sequence(this.audioContext, tempo, notes);

		sequence.gain.gain.value = 0.1;
		sequence.bass.gain.value = 40;
		sequence.createCustomWave([-1, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1]);
		sequence.loop = false;

		this.sounds[name] = sequence;
	}

	play(name) {
		if (this.enabled && this.sounds[name]) {
			this.sounds[name].play();
		}
	}
}

export default Audio;
