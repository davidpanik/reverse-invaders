import { init, Sprite, GameLoop } from './kontra';
let { canvas } = init();

let player = new Sprite({
	x: (canvas.width / 2) - 10,
	y: canvas.height - 40,
	color: 'red',
	width: 20,
	height: 20,
	dx: 2
});

let playerFire = [];

let loop = new GameLoop({
	update: function () {
		player.update();
		playerFire.forEach((fire) => fire.update());

		// Bounce on edges
		if (player.x > canvas.width - player.width || player.x < 0) {
			player.dx *= -1;
		}

		if (random(40) === 1) {
			player.dx *= -1;
		}

		if (random(30) === 1) {
			playerFire.push(Sprite({
				x: player.x + (player.width / 2),
				y: player.y - 10,
				color: 'blue',
				width: 5,
				height: 10,
				dy: -5
			}));
		}
	},
	render: function () {
		player.render();
		playerFire.forEach((fire) => fire.render());
	}
});

loop.start();

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