import SoundFX from '../vendor/soundfx';
import Storage from './storage';

let storage = new Storage();

class Audio {
	constructor() {
		if (storage.get('audio') === 'true') {
			this.enabled = true;
		} else {
			this.enabled = false;
		}

		this.toggle = document.getElementById('audioToggle');

		this.toggle.addEventListener('click', () => {
			this.enabled = !this.enabled;
			this.updateDisplay();
		});

		this.updateDisplay();
	}

	updateDisplay() {
		storage.set('audio', '' + this.enabled);

		if (this.enabled) {
			this.toggle.classList.add('active');
		} else {
			this.toggle.classList.remove('active');
		}
	}

	play(name) {
		if (this.enabled && SoundFX[name]) {
			SoundFX[name]();
		}
	}
}

export default Audio;
