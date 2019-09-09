class Sprite {
	constructor(properties) {
		this.init(properties);
	}

	init(properties) {
		this.ttl = Infinity;
		this.dx = 0;
		this.dy = 0;
	
		for (let property in properties) {
			this[property] = properties[property];
		}
	}

	isAlive() {
		return this.ttl > 0;
	}

	collidesWith(object) {
		if (this.rotation || object.rotation) {
			return null;
		}

		let x = this.x - this.width * this.anchor.x;
		let y = this.y - this.height * this.anchor.y;

		let objX = object.x;
		let objY = object.y;
		if (object.anchor) {
			objX -= object.width * object.anchor.x;
			objY -= object.height * object.anchor.y;
		}

		return (x < objX + object.width &&
			x + this.width > objX &&
			y < objY + object.height &&
			y + this.height > objY);
	}

	update() {
		this.x += this.dx;
		this.y += this.dy;

		this.ttl--;
	}

	render() {
		let anchorWidth = -this.width * this.anchor.x;
		let anchorHeight = -this.height * this.anchor.y;

		if (this.image) {
			this.context.drawImage(
				this.image,
				0, 0, this.image.width, this.image.height,
				this.x + anchorWidth, this.y + anchorHeight, this.width, this.height
			);
		}
		else if (this.currentAnimation) {
			this.currentAnimation.render({
				x: this.x + anchorWidth,
				y: this.y + anchorHeight,
				width: this.width,
				height: this.height,
				context: this.context
			});
		}
		else {
			this.context.fillStyle = this.color;
			this.context.fillRect(this.x + anchorWidth, this.y + anchorHeight, this.width, this.height);
		}

		this.context.restore();
	}
}

export default Sprite;
