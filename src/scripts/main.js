/*

TODO
	Reduce filesize
	Make player and aliens less tightly linked
	Better player dodging
	Stop player flickering about
	Add Event System
	Test on mobile
	Add sprites
	Intro screen
	Handle game end
	Add special alien
	Bring a dead alien back when special alien crosses the screen

	https://reverse-invaders.netlify.com/

*/


import { init, GameLoop } from './vendor/kontra';
import Aliens from './game/aliens';
import Player from './game/player';
import Audio from './util/audio';
import Events from './util/events';
import { random } from './util/random';
import center from './util/center';
import './interface/ghosting';
import './interface/mobileCheck';
import './interface/scaling';


let { canvas } = init('mainCanvas');

canvas.gutter = 10;

let audio = new Audio();
let events = new Events();
let aliens = new Aliens(canvas, audio, events);
let player = new Player(canvas, audio, events, aliens);

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

events.on('ALIENS_REACHED_BOTTOM', () => {
	alert('YOU WIN');
	window.location = window.location;
});

events.on('ALL_ALIENS_DEAD', () => {
	alert('GAME OVER');
	window.location = window.location;
});

events.on('ALIEN_KILLED', (alien) => {
	alien.alive = false;

	audio.play('blow');

	createSparks(aliens, alien, 'red');
});

events.on('PLAYER_LOSE_LIFE', () => {
	player.lives -= 1;
	player.updateDisplay();

	audio.play('explosion');
	createSparks(player, player.sprite, 'green');

	player.sprite.x = canvas.width / 2;
	player.sprite.dx = 0;
	player.chooseTarget();

	if (player.lives <= 0) {
		alert('YOU WIN');
		window.location = window.location;
	}
});

function createSparks(owner, source, color) {
	for (let x = 0; x < random(20, 40); x++) {
		let size = 5;

		owner.sparks.get({
			x: source.x + (source.width / 2),
			y: source.y + (source.height / 2),
			color: color,
			width: size,
			height: size,
			anchor: center,
			dx: random(-300, 300) / 100,
			dy: random(-300, 300) / 100,
			ttl: random(20, 60)
		});
	}
}

loop.start();
