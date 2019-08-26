/*

TODO
	Make player attempt to dodge bullets
	Make player more likely to aim for end aliens
	Add Event System
	Add buttons on mobile
	Add audio toggle button
	Partical collision effects
	Sound effects
	Indicate which aliens are about to fire
	Add sprites
	Add special alien
	Bring a dead alien back when special alien crosses the screen
	Increase alien speed as game progresses
	Handle game end

	https://reverse-invaders.netlify.com/

*/


import { init, GameLoop } from './vendor/kontra';
import createAliens from './aliens';
import createPlayer from './player';
import createAudio from './audio';

let { canvas } = init();

canvas.gutter = 10;

let audio = createAudio();
let aliens = createAliens(canvas, audio);
let player = createPlayer(canvas, audio, aliens);

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
