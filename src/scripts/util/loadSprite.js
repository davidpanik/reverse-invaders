import { SpriteSheet } from '../vendor/kontra';

export default function loadSprite(url, width, height, callback) {
	let sprite;
	let image = new Image();

	image.onload = function () {
		sprite = new SpriteSheet({
			image: image,
			frameWidth: width,
			frameHeight: height,
			animations: {
				walk: {
					frames: '0..3',
					frameRate: 4
				}
			}
		});
		callback(sprite);
	};

	image.src = url;
}
