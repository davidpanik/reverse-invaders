/*

TODO
	Cooldown on weapon has stopped working	
	Missile collision detection has stopped working
	Display player lives
	Detect player and alien collisions
	Detect alien reaching bottom of screen
	Partical collision effects
	Sound effects
	Work out lowest alien in each column
	Indicate which aliens are about to fire
	Add sprites
	Add special alien
	Bring a dead alien back when special alien crosses the screen
	Make player aim for specific aliens
	Make player attempt to dodge bullets
	Start splitting out code
	Host on Netlify
	Increase alien speed as game progresses
	Handle game end

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
