import SoundFX from './vendor/soundfx';

class Audio {
	constructor() {
		this.enabled = false;

		document.addEventListener('click', () => {
			this.enabled = !this.enabled;
		});
	}

	play(name) {
		if (this.enabled && SoundFX[name]) {
			SoundFX[name]();
		}
	}
}

export default Audio;
