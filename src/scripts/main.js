/*

TODO
	Indicate which aliens are about to fire
	Better player dodging	
	Increase alien speed as game progresses
	Add Event System
	Add buttons on mobile
	Add sprites
	Add audio toggle button
	Sound effects
	Partical collision effects
	Intro screen
	Handle game end
	Add special alien
	Bring a dead alien back when special alien crosses the screen
	Add ghosting to screen

	https://reverse-invaders.netlify.com/

*/


import { init, GameLoop } from './vendor/kontra';
import createAliens from './aliens';
import createPlayer from './player';
import createAudio from './audio';
import Events from './events';

let { canvas } = init();

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
