class GameLoop {
	constructor(options) {
		this.options = options;
		this.running = false;
		this.raf = null;
		this.delta = 1E3 / 60;
		this.accumulator = 0;
		this.last = performance.now();
	}

	start() {
		if (!this.running) {
			this.running = true;
			this.raf = requestAnimationFrame(this.tick.bind(this));
		}
	}
	stop() {
		this.running = false;
		cancelAnimationFrame(this.raf);
	}
	tick() {
		let now = performance.now();
		let dt = now - this.last;
		this.last = now;

		this.accumulator += dt;

		while (this.accumulator >= this.delta) {
			if (this.options.render) {
				this.options.render();
			}

			this.accumulator -= this.delta;
		}

		if (true && this.options.update) {
			this.options.update();
		}

		if (this.running) {
			this.raf = requestAnimationFrame(this.tick.bind(this));
		}
	}
}

export default GameLoop;
