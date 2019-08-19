import { init, Sprite, GameLoop, Pool, initKeys, keyPressed } from './kontra';
let { canvas } = init();

initKeys();

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
			alive: true,
			update: function() {
				if (keyPressed('left')) {
					this.x -= 2;
				} else if (keyPressed('right')) {
					this.x += 2;
				}
			}
		}));
	}
}

let playerMissiles = new Pool({
	create: Sprite
});

let alienMissiles = new Pool({
	create: Sprite
});

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
		else if (player.x > canvas.width - player.width - 20 || player.x < 20) {
			player.dx *= -1;
		}

		if (chance(50)) {
			playerMissiles.get({
				x: player.x + (player.width / 2),
				y: player.y - 10,
				color: 'green',
				width: 5,
				height: 15,
				anchor: { x: 0.5, y: 0.5 },
				dy: -3,
				ttl: canvas.height
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
	},
	render: function () {
		player.render();
		aliens.filter((alien) => alien.alive).forEach((alien) => alien.render());
		playerMissiles.render();
		alienMissiles.render();
	}
});

loop.start();

function chance(n) {
	return (random(n) === 0);
}

function random(r1, r2, r3) {
	let min = 0;
	let max = 0;
	let interval = 1;
	let result;

	if (typeof (r1) !== 'undefined') {
		min = 0;
		max = r1;
	}

	if (typeof (r2) !== 'undefined') {
		min = r1;
		max = r2;
	}

	if (typeof (r3) !== 'undefined') {
		interval = r3;
	}

	result = Math.floor(Math.random() * (max - min)) + min;

	if (interval > 1) {
		result = Math.round(result / interval) * interval;
	}

	return result;
}
