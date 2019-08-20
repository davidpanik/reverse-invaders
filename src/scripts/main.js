/*

TODO
	Start aliens centered
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
let playerLives = 5;
let playerCooldown = 1000;
let alienCooldown = 1000;
let alienRows = 4;
let alienColumns = 10;
let alienWidth = 40;
let alienHeight = 40;
let alienSpacing = 20;

let player = new Sprite({
	x: (canvas.width / 2) - 10,
	y: canvas.height - 40,
	color: 'red',
	width: 30,
	height: 20,
	anchor: center,
	dx: 2,
	weaponReady: true
});

let aliens = [];

for (let x = 0; x < alienRows; x++) {
	for (let y = 0; y < alienColumns; y++) {
		aliens.push(new Sprite({
			x: ((alienWidth + alienSpacing) * y) + 50,
			y: ((alienWidth + alienSpacing) * x) + 50,
			color: 'blue',
			width: alienWidth,
			height: alienHeight,
			anchor: center,
			alive: true,
			weaponReady: true
		}));
	}
}

let playerMissiles = new Pool({
	create: Sprite
});

let alienMissiles = new Pool({
	create: Sprite
});

function sortByX(alpha, beta) {
	return (alpha.x > beta.x) ? 1 : (beta.x > alpha.x) ? -1 : 0;
}

function sortByY(alpha, beta) {
	return (alpha.y > beta.y) ? 1 : (beta.y > alpha.y) ? -1 : 0;
}

function leftMostAlien() {
	return aliens.filter((alien) => alien.alive).sort(sortByX)[0];
}

function rightMostAlien() {
	return aliens.filter((alien) => alien.alive).sort(sortByX).slice(-1)[0];
}

function getLowestAliens() {
	let lowestAlien = aliens.filter((alien) => alien.alive).sort(sortByY).slice(-1)[0];

	return aliens.filter((alien) => alien.alive).filter((alien) => alien.y === lowestAlien.y);
}

function getLivingAliens() {
	return aliens.filter((alien) => alien.alive);
}

function getDeadAliens() {
	return aliens.filter((alien) => alien.alive !== false);
}

let loop = new GameLoop({
	update: function () {
		if (getDeadAliens().length <= 0) {
			alert('GAME OVER');
			window.location = window.location;
		}

		player.update();
		getLivingAliens().forEach((alien) => alien.update());
		playerMissiles.update();
		alienMissiles.update();

		if (chance(40)) {
			player.dx *= -1;
		}
		// Bounce on edges
		else if (player.x > canvas.width - gutter - (player.width / 2) || player.x < gutter + (player.width / 2)) {
			player.dx *= -1;
		}

		if (chance(50)) {
			if (player.weaponReady) {
				playerMissiles.get({
					x: player.x,
					y: player.y - (player.height / 2),
					color: 'green',
					width: 5,
					height: 15,
					anchor: center,
					dy: -3,
					ttl: canvas.height
				});

				audio.play('playerShoot');

				player.weaponReady = false;
				setTimeout(() => {
					player.weaponReady = true;
				}, playerCooldown);
			}
		}
		
		getLowestAliens().forEach((alien) => {
			if (chance(100)) {
				if (alien.weaponReady) {
					alienMissiles.get({
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
					}, alienCooldown);
				}
			}
		});

		playerMissiles.getAliveObjects().forEach((missile) => {
			getLivingAliens().forEach((alien) => {
				if (missile.collidesWith(alien)) {
					alien.alive = false;
					missile.ttl = 0;
				}
			});
		});

		alienMissiles.getAliveObjects().forEach((missile) => {
			if (missile.collidesWith(player)) {
				console.log('impact', playerLives);
				playerLives -= 1;
				missile.ttl = 0;

				if (playerLives <= 0) {
					alert('YOU WIN!');
					window.location = window.location;
				}
			}
		});
		
		if (keyPressed('left')) {
			if (leftMostAlien().x > gutter + (aliens[0].width / 2)) {
				aliens.forEach((alien) => {
					alien.x -= 2;
				});
			}
		} else if (keyPressed('right')) {
			if (rightMostAlien().x < canvas.width - gutter - (aliens[0].width / 2)) {
				aliens.forEach((alien) => {
					alien.x += 2;
				});
			}
		}

		aliens.forEach((alien) => {
			alien.y += 0.01;
		});
	},
	render: function () {
		player.render();
		getLivingAliens().forEach((alien) => alien.render());
		playerMissiles.render();
		alienMissiles.render();
	}
});

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
