/*

TODO
	Refactor to use classes
	Reduce filesize
	Break up logic
	Better player dodging
	Stop player flickering about
	Add Event System
	Scale game to screen size
	Test on mobile
	Add sprites
	Add audio toggle button
	Sound effects
	Intro screen
	Handle game end
	Add special alien
	Bring a dead alien back when special alien crosses the screen

	https://reverse-invaders.netlify.com/

*/


import { init, GameLoop } from './vendor/kontra';
import createAliens from './aliens';
import createPlayer from './player';
import createAudio from './audio';
import Events from './events';
import './ghosting';
import './mobileCheck';

let { canvas } = init('mainCanvas');

canvas.gutter = 10;

let audio = createAudio();
let events = new Events();
let aliens = createAliens(canvas, audio, events);
let player = createPlayer(canvas, audio, events, aliens);


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

loop.start();
