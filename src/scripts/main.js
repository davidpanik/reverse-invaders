/*

TODO
	Display player lives
	Detect when all aliens are dead
	Partical collision effects
	Sound effects
	Work out lowest alien in each column
	Add cooldown to weapons
	Indicate which aliens are about to fire
	Add special alien
	Bring a dead alien back when special alien crosses the screen
	Make player aim for specific aliens
	Make player attempt to dodge bullets
	Start splitting out code

*/


import { init, Sprite, GameLoop, Pool, initKeys, keyPressed } from './kontra';
import { chance, random } from './random';

let { canvas } = init();

initKeys();

const gutter = 20;
let playerLives = 5;


let player = new Sprite({
	x: (canvas.width / 2) - 10,
	y: canvas.height - 40,
	color: 'red',
	width: 30,
	height: 20,
	anchor: { x: 0.5, y: 0.5 },
	dx: 2
});

let aliens = [];

for (let x = 0; x < 4; x++) {
	for (let y = 0; y < 10; y++) {
		aliens.push(new Sprite({
			x: (60 * y) + 50,
			y: (60 * x) + 50,
			color: 'blue',
			width: 40,
			height: 40,
			anchor: { x: 0.5, y: 0.5 },
			alive: true
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

let loop = new GameLoop({
	update: function () {
		player.update();
		aliens.filter((alien) => alien.alive).forEach((alien) => alien.update());
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
			playerMissiles.get({
				x: player.x + (player.width / 2),
				y: player.y - (player.height / 2),
				color: 'green',
				width: 5,
				height: 15,
				anchor: { x: 0.5, y: 0.5 },
				dy: -3,
				ttl: canvas.height
			});
		}

		if (chance(100)) {
			getLowestAliens().forEach((alien) => {
				alienMissiles.get({
					x: alien.x + (alien.width / 2),
					y: alien.y + (alien.height / 2),
					color: 'yellow',
					width: 5,
					height: 15,
					anchor: { x: 0.5, y: 0.5 },
					dy: 3,
					ttl: canvas.height
				});
			});
		}

		playerMissiles.getAliveObjects().forEach((missile) => {
			aliens.filter((alien) => alien.alive).forEach((alien) => {
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
					console.log('YOU WIN!');
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
		aliens.filter((alien) => alien.alive).forEach((alien) => alien.render());
		playerMissiles.render();
		alienMissiles.render();
	}
});

loop.start();
