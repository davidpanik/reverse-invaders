import { Sprite, Pool, SpriteSheet } from '../vendor/kontra';
import { leftPressed, rightPressed } from '../util/keys';
import { colorGreen } from './colors';
import center from '../util/center';


function sortByX(alpha, beta) {
	return (alpha.x > beta.x) ? 1 : (beta.x > alpha.x) ? -1 : 0;
}

function sortByY(alpha, beta) {
	return (alpha.y > beta.y) ? 1 : (beta.y > alpha.y) ? -1 : 0;
}

let alien1;
let image1 = new Image();
image1.onload = function () {
	alien1 = new SpriteSheet({
		image: image1,
		frameWidth: 10,
		frameHeight: 7,
		animations: {
			walk: {
				frames: '0..3',
				frameRate: 4
			}
		}
	});
};
image1.src = '/images/alien1.png';

let alien2;
let image2 = new Image();
image2.onload = function () {
	alien2 = new SpriteSheet({
		image: image2,
		frameWidth: 10,
		frameHeight: 7,
		animations: {
			walk: {
				frames: '0..3',
				frameRate: 4
			}
		}
	});
};
image2.src = '/images/alien2.png';

let alien3;
let image3 = new Image();
image3.onload = function () {
	alien3 = new SpriteSheet({
		image: image3,
		frameWidth: 10,
		frameHeight: 7,
		animations: {
			walk: {
				frames: '0..3',
				frameRate: 4
			}
		}
	});
};
image3.src = '/images/alien3.png';

class Aliens {
	constructor(canvas, audio, events) {
		this.canvas = canvas;
		this.audio = audio;
		this.events = events;

		// STATIC
		this.fireDelay = 1000;
		this.cooldown = 2000;
		this.switchingInterval = 3000;
		this.rows = 4;
		this.columns = 8;
		this.width = 40;
		this.height = 30;
		this.spacing = 30;
		this.descent = 0.05;
		this.maxSpeed = 8;

		// VARIABLE
		this.speed = 1;
		this.firingFrom = '';
		this.weaponsReady = true;
		this.switchingTimer = null;

		// DISPLAY
		this.sprites = [];
		this.missiles = new Pool({
			create: Sprite
		});
		this.sparks = new Pool({
			create: Sprite
		});

		this.populateGrid();
		this.handleSwitching();
	}
	populateGrid() {
		let offsetLeft = (this.canvas.width - (this.columns * this.width) - ((this.columns - 1) * this.spacing)) / 2;
		let sprites = [alien1.animations, alien2.animations, alien3.animations, alien1.animations];
		for (let row = 0; row < this.rows; row++) {
			for (let column = 0; column < this.columns; column++) {
				this.sprites.push(new Sprite({
					x: ((this.width + this.spacing) * column) + offsetLeft + (this.width / 2),
					y: ((this.width + this.spacing) * row) + 50,
					// color: 'blue',
					width: this.width,
					height: this.height,
					anchor: center,
					animations: sprites[row],
					alive: true,
					aboutToFire: false
				}));
			}
		}
	}
	handleSwitching() {
		this.switchingTimer = setInterval(() => {
			if (this.firingFrom === 'odd') {
				this.firingFrom = 'even';
			} else {
				this.firingFrom = 'odd';
			}
		}, this.switchingInterval);
	}

	update () {
		this.checkStillAlive();
		this.workOutSpeed();
		this.fireMissiles();
		this.checkForHittingBottom();
		this.handleInput();
		this.moveDownwards();

		this.getAlive().forEach((alien) => alien.update());
		this.missiles.update();
		this.sparks.update();
	}
	checkStillAlive() {
		if (this.getAlive().length <= 0) {
			this.events.emit('ALL_ALIENS_DEAD');
		}
	}
	workOutSpeed() {
		this.speed = (this.maxSpeed + 1) - ((this.getAlive().length / this.sprites.length) * this.maxSpeed);
	}
	fireMissiles() {
		this.getColumns(this.getAlive().length > 1 ? this.firingFrom : 'all').forEach((alien) => {
			if (this.weaponsReady && !alien.aboutToFire) {
				alien.aboutToFire = true;
				// alien.color = 'yellow';

				setTimeout(() => {
					this.missiles.get({
						x: alien.x,
						y: alien.y + (alien.height / 2),
						color: colorGreen,
						width: 5,
						height: 15,
						anchor: center,
						dy: 3,
						ttl: this.canvas.height
					});

					this.audio.play('pew');
					this.weaponsReady = false;

					setTimeout(() => {
						alien.aboutToFire = false;
						// alien.color = 'blue';
					}, 500);

					setTimeout(() => {
						this.weaponsReady = true;
					}, this.cooldown);
				}, this.fireDelay);
			}
		});
	}
	checkForHittingBottom() {
		this.getColumns(this.firingFrom).forEach((alien) => {
			if (alien.y + (alien.height / 2) > this.canvas.height) {
				this.events.emit('ALIENS_REACHED_BOTTOM');
			}
		});
	}
	handleInput() {
		if (leftPressed()) {
			if (this.getLeftMost().x > this.canvas.gutter + (this.width / 2)) {
				this.sprites.forEach((alien) => {
					alien.x -= this.speed;
				});
			}
		} else if (rightPressed()) {
			if (this.getRightMost().x < this.canvas.width - this.canvas.gutter - (this.width / 2)) {
				this.sprites.forEach((alien) => {
					alien.x += this.speed;
				});
			}
		}
	}
	moveDownwards() {
		this.sprites.forEach((alien) => {
			alien.y += this.descent;
		});
	}
	render() {
		this.sparks.render();
		this.missiles.render();
		let date = new Date();
		this.getAlive().forEach((alien) => {
			if (!alien.aboutToFire || date.getMilliseconds() % 5 === 1) {
				alien.render();
			}
		});
	}

	// HELPERES
	getLeftMost() {
		return this.getAlive().sort(sortByX)[0];
	}
	getRightMost() {
		return this.getAlive().sort(sortByX).slice(-1)[0];
	}
	getLowest() {
		let lowestAlien = this.getAlive().sort(sortByY).slice(-1)[0];

		return this.getAlive().filter((alien) => alien.y === lowestAlien.y);
	}
	getColumns(specifier = '') {
		let columns = {};
		let aliens = [];

		this.getAlive().forEach((alien) => {
			if (!columns['c' + alien.x]) {
				columns['c' + alien.x] = [];
			}

			columns['c' + alien.x].push(alien);
		});

		for (let column in columns) {
			aliens.push(columns[column].sort(sortByY).slice(-1)[0]);
		}

		aliens = aliens.sort(sortByX);

		if (specifier === 'odd') {
			return aliens.filter((alien, index) => (index % 2 === 0));
		} else if (specifier === 'even') {
			return aliens.filter((alien, index) => (index % 2 !== 0));
		} else if (specifier === 'all') {
			return aliens;
		}

		return [];
	}
	getAlive() {
		return this.sprites.filter((alien) => alien.alive === true);
	}
	getDead() {
		return this.sprites.filter((alien) => alien.alive === false);
	}
}

export default Aliens;
