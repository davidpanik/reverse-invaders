/*

TODO
	Display player lives
	Partical collision effects
	Sound effects
	Work out lowest alien in each column
	Indicate which aliens are about to fire
	Add sprites
	Add special alien
	Bring a dead alien back when special alien crosses the screen
	Make player aim for specific aliens
	Make player attempt to dodge bullets
	Start splitting out code
	Host on Netlify
	Increase alien speed as game progresses
	Handle game end

*/


import { init, Sprite, GameLoop, Pool, initKeys, keyPressed } from './vendor/kontra';
import TinyMusic from './vendor/TinyMusic';
import { chance } from './random';

let { canvas } = init();

initKeys();

const center = {
	x: 0.5,
	y: 0.5
};
const gutter = 10;

function sortByX(alpha, beta) {
	return (alpha.x > beta.x) ? 1 : (beta.x > alpha.x) ? -1 : 0;
}

function sortByY(alpha, beta) {
	return (alpha.y > beta.y) ? 1 : (beta.y > alpha.y) ? -1 : 0;
}


let player = {
	// STATIC
	cooldown: 1000,

	// VARIABLE
	weaponReady: true,
	lives: 500,

	// DISPLAY
	sprite: new Sprite({
		x: (canvas.width / 2) - 10,
		y: canvas.height - 40,
		color: 'red',
		width: 30,
		height: 20,
		anchor: center,
		dx: 2
	}),
	missiles: new Pool({
		create: Sprite
	}),

	// FUNCTIONS
	update: function() {
		if (chance(40)) {
			this.sprite.dx *= -1;
		}
		// Bounce on edges
		else if (this.sprite.x > canvas.width - gutter - (this.sprite.width / 2) || this.sprite.x < gutter + (this.sprite.width / 2)) {
			this.sprite.dx *= -1;
		}

		if (chance(50)) {
			if (this.weaponReady) {
				this.missiles.get({
					x: this.sprite.x,
					y: this.sprite.y - (this.sprite.height / 2),
					color: 'green',
					width: 5,
					height: 15,
					anchor: center,
					dy: -3,
					ttl: canvas.height
				});

				audio.play('playerShoot');

				this.weaponReady = false;
				setTimeout(() => {
					this.weaponReady = true;
				}, this.Cooldown);
			}
		}
		
		this.missiles.getAliveObjects().forEach((missile) => {
			aliens.getAlive().forEach((alien) => {
				if (missile.collidesWith(alien)) {
					alien.alive = false;
					missile.ttl = 0;
				}
			});
		});

		this.sprite.update();
		this.missiles.update();
	},
	render: function() {
		this.sprite.render();
		this.missiles.render();
	}
};

let aliens = {
	// STATIC
	cooldown: 1000,
	rows: 4,
	columns: 10,
	width: 40,
	height: 40,
	spacing: 20,
	descent: 0.1,

	// VARIABLE
	speed: 2,

	// DISPLAY
	sprites: [],
	missiles: new Pool({
		create: Sprite
	}),

	// FUNCTIONS	
	init: function() {
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
					weaponReady: true
				}));
			}
		}		
	},
	update: function() {
		if (this.getAlive().length <= 0) {
			alert('GAME OVER');
			window.location = window.location;
		}

		this.getAlive().forEach((alien) => alien.update());
		this.missiles.update();

		this.getLowest().forEach((alien) => {
			if (chance(100)) {
				if (alien.weaponReady) {
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

					alien.weaponReady = false;
					setTimeout(() => {
						alien.weaponReady = true;
					}, this.cooldown);
				}
			}
		});

		if (keyPressed('left')) {
			if (this.getLeftMost().x > gutter + (this.width / 2)) {
				this.sprites.forEach((alien) => {
					alien.x -= this.speed;
				});
			}
		} else if (keyPressed('right')) {
			if (this.getRightMost().x < canvas.width - gutter - (this.width / 2)) {
				this.sprites.forEach((alien) => {
					alien.x += this.speed;
				});
			}
		}

		this.sprites.forEach((alien) => {
			alien.y += this.descent;
		});
	},
	render: function() {
		this.getAlive().forEach((alien) => alien.render());
		this.missiles.render();
	},

	// HELPERES
	getLeftMost: function() {
		return this.getAlive().sort(sortByX)[0];
	},
	getRightMost: function () {
		return this.getAlive().sort(sortByX).slice(-1)[0];
	},
	getLowest: function() {
		let lowestAlien = this.getAlive().sort(sortByY).slice(-1)[0];

		return this.getAlive().filter((alien) => alien.y === lowestAlien.y);
	},
	getAlive: function () {
		return this.sprites.filter((alien) => alien.alive === true);
	},
	getDead: function () {
		return this.sprites.filter((alien) => alien.alive === false);
	}
};

let loop = new GameLoop({
	update: function () {
		player.update();
		aliens.update();
	},
	render: function () {
		player.render();
		aliens.render();
	}
});

aliens.init();
loop.start();

let audio = {
	enabled: false,
	sounds: {},
	audioContext: null,

	init: function() {
		this.audioContext = new AudioContext();

		document.addEventListener('click', () => {
			console.log('clicked', this.enabled);
			this.enabled = !this.enabled;
		});		
	},

	add: function(name, tempo, notes) {
		let sequence = new TinyMusic.Sequence(this.audioContext, tempo, notes);

		sequence.gain.gain.value = 0.1;
		sequence.bass.gain.value = 40;
		sequence.createCustomWave([-1, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1]);
		sequence.loop = false;

		this.sounds[name] = sequence;
	},

	play: function(name) {
		if (this.enabled && this.sounds[name]) {
			this.sounds[name].play();
		}
	}
};

audio.add('playerShoot', 200, ['G3 s']);
audio.add('alienShoot', 200, ['C3 s']);

audio.init();
