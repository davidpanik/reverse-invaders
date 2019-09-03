/*

TODO
	Player is now too hard to hit
	Game gets faster on reset
	Reduce filesize
	Add sprites
	Test on mobile
	General styling
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
import Navigation from './util/navigation';
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
let startTime;

let audio = new Audio();
let events = new Events();
let navigation = new Navigation();

function newGame() {
	navigation.go('game');

	aliens = new Aliens(canvas, audio, events);
	player = new Player(canvas, audio, events, aliens);

	startTime = new Date();

	if (loop && loop.stop) {
		loop.stop();
	}

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
	events.emit('ALIENS_WIN');
});

events.on('ALL_ALIENS_DEAD', () => {
	loop.stop();
	navigation.go('results');
	document.getElementById('outcome').innerHTML = 'Game over';
	document.getElementById('score').innerHTML = getFinalScore();
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
		events.emit('ALIENS_WIN');
	} else {
		player.respawn();
	}
});

events.on('ALIENS_WIN', () => {
	loop.stop();
	navigation.go('results');
	document.getElementById('results').innerHTML = 'You win';
	document.getElementById('score').innerHTML = getFinalScore();
});


// Navigate between screens
document.addEventListener('keydown', handleNavigation);
document.addEventListener('click', handleNavigation);

function handleNavigation() {
	switch (navigation.current) {
	case 'intro':
		newGame();
		break;
	case 'results':
		newGame();
		break;
	}
}

function getFinalScore() {
	let endTime = new Date();
	let seconds = (endTime - startTime) / 1000;
	const longestTime = (5 * 1000);

	let finalScore = longestTime - seconds;
	finalScore += (aliens.getAlive().length * 1000);
	finalScore = Math.round(finalScore);

	if (finalScore < 0) {
		finalScore = 0;
	}

	return finalScore;
}

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

navigation.go('intro');
