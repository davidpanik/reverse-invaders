import SoundFX from '../vendor/soundfx';

class Audio {
	constructor() {
		this.enabled = false;
		this.toggle = document.getElementById('audioToggle');

		this.toggle.addEventListener('click', () => {
			this.enabled = !this.enabled;
			this.updateDisplay();
		});
	}

	updateDisplay() {
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
