import { Sprite, Pool, initKeys, keyPressed } from './vendor/kontra';
import { chance } from './random';

const center = {
	x: 0.5,
	y: 0.5
};

function sortByX(alpha, beta) {
	return (alpha.x > beta.x) ? 1 : (beta.x > alpha.x) ? -1 : 0;
}

function sortByY(alpha, beta) {
	return (alpha.y > beta.y) ? 1 : (beta.y > alpha.y) ? -1 : 0;
}

export default function createAliens(canvas, audio, events) {
	let aliens = {
		// STATIC
		fireDelay: 1000,
		cooldown: 2000,
		switchingInterval: 3000,
		rows: 4,
		columns: 10,
		width: 40,
		height: 40,
		spacing: 20,
		descent: 0.1,
		maxSpeed: 8,

		// VARIABLE
		speed: 1,
		firingFrom: '',
		weaponsReady: true,

		// DISPLAY
		sprites: [],
		missiles: new Pool({
			create: Sprite
		}),

		// FUNCTIONS	
		init: function () {
			let offsetLeft = (canvas.width - (this.columns * this.width) - ((this.columns - 1) * this.spacing)) / 2;

			for (let row = 0; row < this.rows; row++) {
				for (let column = 0; column < this.columns; column++) {
					this.sprites.push(new Sprite({
						x: ((this.width + this.spacing) * column) + offsetLeft + (this.width / 2),
						y: ((this.width + this.spacing) * row) + 50,
						color: 'blue',
						width: this.width,
						height: this.height,
						anchor: center,
						alive: true,
						aboutToFire: false
					}));
				}
			}

			setInterval(() => {
				if (this.firingFrom === 'odd') {
					this.firingFrom = 'even';
				} else {
					this.firingFrom = 'odd';
				}
			}, this.switchingInterval);
		},
		update: function () {
			if (this.getAlive().length <= 0) {
				alert('GAME OVER');
				window.location = window.location;
			}

			this.speed = (this.maxSpeed + 1) - ((this.getAlive().length / this.sprites.length) * this.maxSpeed);

			this.getAlive().forEach((alien) => alien.update());
			this.missiles.update();

			this.getColumns(this.firingFrom).forEach((alien) => {
				if (this.weaponsReady && !alien.aboutToFire) {
					alien.aboutToFire = true;
					alien.color = 'yellow';						

					setTimeout(() => {
						this.missiles.get({
							x: alien.x,
							y: alien.y + (alien.height / 2),
							color: 'yellow',
							width: 5,
							height: 15,
							anchor: center,
							dy: 3,
							ttl: canvas.height
						});

						audio.play('alienShoot');
						this.weaponsReady = false;

						setTimeout(() => {
							alien.aboutToFire = false;
							alien.color = 'blue';
						}, 500);

						setTimeout(() => {
							this.weaponsReady = true;
						}, this.cooldown);
					}, this.fireDelay);
				}

				if (alien.y + (alien.height / 2) > canvas.height) {
					alert('YOU WIN');
					window.location = window.location;
				}
			});

			if (keyPressed('left')) {
				if (this.getLeftMost().x > canvas.gutter + (this.width / 2)) {
					this.sprites.forEach((alien) => {
						alien.x -= this.speed;
					});
				}
			} else if (keyPressed('right')) {
				if (this.getRightMost().x < canvas.width - canvas.gutter - (this.width / 2)) {
					this.sprites.forEach((alien) => {
						alien.x += this.speed;
					});
				}
			}

			this.sprites.forEach((alien) => {
				alien.y += this.descent;
			});
		},
		render: function () {
			this.getAlive().forEach((alien) => alien.render());
			this.missiles.render();
		},

		// HELPERES
		getLeftMost: function () {
			return this.getAlive().sort(sortByX)[0];
		},
		getRightMost: function () {
			return this.getAlive().sort(sortByX).slice(-1)[0];
		},
		getLowest: function() {
			let lowestAlien = this.getAlive().sort(sortByY).slice(-1)[0];

			return this.getAlive().filter((alien) => alien.y === lowestAlien.y);
		},
		getColumns: function (specifier = '') {
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
		},
		getAlive: function () {
			return this.sprites.filter((alien) => alien.alive === true);
		},
		getDead: function () {
			return this.sprites.filter((alien) => alien.alive === false);
		}
	};

	initKeys();
	aliens.init();

	return aliens;
}
