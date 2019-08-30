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

loop.start();
