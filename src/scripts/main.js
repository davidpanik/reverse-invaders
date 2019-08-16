import { init, Sprite, GameLoop, Pool } from './kontra';
let { canvas } = init();

let player = new Sprite({
	x: (canvas.width / 2) - 10,
	y: canvas.height - 40,
	color: 'red',
	width: 20,
	height: 20,
	dx: 2
});

let playerMissiles = new Pool({
	create: Sprite
});

let loop = new GameLoop({
	update: function () {
		player.update();
		playerMissiles.update();

		// Bounce on edges
		if (player.x > canvas.width - player.width || player.x < 0) {
			player.dx *= -1;
		}

		if (chance(40)) {
			player.dx *= -1;
		}

		if (chance(30)) {
			playerMissiles.get({
				x: player.x + (player.width / 2),
				y: player.y - 10,
				color: 'green',
				width: 3,
				height: 8,
				dy: -5,
				ttl: canvas.height
			});
		}
	},
	render: function () {
		player.render();
		playerMissiles.render();
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
