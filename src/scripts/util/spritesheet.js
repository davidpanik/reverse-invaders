class Spritesheet {
	constructor(url, frames) {
		this.currentFrame = 0;
		this.frames = frames;
		this.animationSpeed = 100;
		this.counter = 0;

		let image = new Image();
		image.onload = () => {
			this.image = image;
			this.width = image.width / this.frames;
			this.height = image.height;			
		};
		image.src = url;
	}

	render(details) {
		if (this.image) {
			details.context.drawImage(
				this.image,
				this.currentFrame * this.width,
				0,
				this.width,
				this.height,
				details.x,
				details.y,
				details.width, details.height
			);
		}

		this.counter++;

		if (this.counter > this.animationSpeed) {
			this.counter = 0;

			this.currentFrame++;
			if (this.currentFrame >= this.frames) {
				this.currentFrame = 0;
			}
		}
	}
}

export default Spritesheet;
