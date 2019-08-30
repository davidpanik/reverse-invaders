class Events {
	constructor() {
		this.queue = {};

		return this;
	}

	emit(event, data) {
		if (this.queue[event]) {
			this.queue[event].forEach((callback) => { callback(data); });
		}
	}

	on(event, callback) {
		if (!this.queue[event]) {
			this.queue[event] = [];
		}

		this.queue[event].push(callback);

		return this;
	}

	off(event, callback) {
		if (this.queue[event]) {
			let index = this.queue[event].indexOf(callback);

			if (index) {
				this.queue[event].splice(index, 1);
			}
		}

		return this;
	}
}

export default Events;
