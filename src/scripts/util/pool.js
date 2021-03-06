import Sprite from './sprite';

class Pool {
	constructor() {
		this.clear();
	}

	get(something) {
		let deadObjects = this.getDeadObjects();

		if (deadObjects.length > 0) {
			deadObjects[0].init(something);
		} else {
			this.objects.push(new Sprite(something));
		}
	}

	getDeadObjects() {
		return this.objects.filter((sprite) => (sprite.ttl <= 0));
	}

	getAliveObjects() {
		return this.objects.filter((sprite) => (sprite.ttl > 0));
	}

	clear() {
		this.objects = [];
	}
	update() {
		this.getAliveObjects().forEach((sprite) => { sprite.update(); });
	}
	render() {
		this.getAliveObjects().forEach((sprite) => { sprite.render(); });
	}
}

export default Pool;
