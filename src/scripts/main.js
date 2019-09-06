/*

TODO
	Replace init
	Replace Sprite
	Replace Pool
	Replace SpriteSheet
	Nicer way of showing "about to fire" state
	Reduce filesize
	Player is now too hard to hit
	Test on mobile
	Add special alien
	Make player aim for special alien
	Bring a dead alien back when special alien crosses the screen

	https://reverse-invaders.netlify.com/

*/

/*
██████--███████-██---██-███████-██████--███████-███████<br/>
██---██-██------██---██-██------██---██-██------██-----<br/>
██████--█████---██---██-█████---██████--███████-█████--<br/>
██---██-██-------██-██--██------██---██------██-██-----<br/>
██---██-███████---███---███████-██---██-███████-███████<br/>
<br/>
██-███----██-██---██--█████--██████--███████-██████--███████<br/>
██-████---██-██---██-██---██-██---██-██------██---██-██-----<br/>
██-██-██--██-██---██-███████-██---██-█████---██████--███████<br/>
██-██--██-██--██-██--██---██-██---██-██------██---██------██<br/>
██-██---████---███---██---██-██████--███████-██---██-███████<br/>
*/

import { init } from './vendor/kontra';
import Aliens from './game/aliens';
import Player from './game/player';
import Audio from './util/audio';
import Events from './util/events';
import Navigation from './util/navigation';
import GameLoop from './util/gameLoop';
import { random } from './util/random';
import { colorOrange, colorGreen } from './game/colors';
import center from './util/center';
import './interface/ghosting';
import './interface/mobileCheck';
import './interface/scaling';


let { canvas } = init('mainCanvas');
canvas.gutter = 10;

let context = canvas.getContext('2d');

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
			context.clearRect(0, 0, canvas.width, canvas.height);
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
	document.getElementById('results').setAttribute('class', 'failure');
	document.getElementById('score').innerHTML = getFinalScore();
});

events.on('ALIEN_KILLED', (alien) => {
	alien.alive = false;

	audio.play('blow');

	createSparks(aliens, alien, colorOrange);
});

events.on('PLAYER_LOSE_LIFE', () => {
	player.lives -= 1;
	player.updateDisplay();

	audio.play('explosion');
	createSparks(player, player.sprite, colorGreen);

	if (player.lives <= 0) {
		events.emit('ALIENS_WIN');
	} else {
		player.respawn();
	}
});

events.on('ALIENS_WIN', () => {
	loop.stop();
	navigation.go('results');
	document.getElementById('results').setAttribute('class', 'success');
	document.getElementById('score').innerHTML = getFinalScore();
});


// Navigate between screens
document.addEventListener('keydown', (event) => {
	if (event.keyCode === 13 || event.keyCode === 32) {
		handleNavigation();
	}
});
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
