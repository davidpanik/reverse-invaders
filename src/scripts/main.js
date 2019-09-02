/*

TODO
	Better player dodging
	Stop player flickering about
	Record time taken to win game
	Reduce filesize
	Add sprites
	Test on mobile
	Handle game end
	Intro screen
	Make player and aliens less tightly linked
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

let aliens;
let player;
let loop;

let audio = new Audio();
let events = new Events();

function newGame() {
	aliens = new Aliens(canvas, audio, events);
	player = new Player(canvas, audio, events, aliens);

	loop = new GameLoop({
		update: function () {
			player.update();
			aliens.update();
		},
		render: function () {
			player.render();
			aliens.render();
		}
	});

	loop.start();
}

events.on('ALIENS_REACHED_BOTTOM', () => {
	alert('YOU WIN');
	newGame();
});

events.on('ALL_ALIENS_DEAD', () => {
	alert('GAME OVER');
	newGame();
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

	if (player.lives <= 0) {
		alert('YOU WIN');
		newGame();
	} else {
		player.respawn();
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

newGame();
