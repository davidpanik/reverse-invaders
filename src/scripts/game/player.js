import { Sprite, Pool } from '../vendor/kontra';
import { chance, randomFromArray } from '../util/random';
import center from '../util/center';


class Player {
	constructor(canvas, audio, events, aliens) {
		this.canvas = canvas;
		this.audio = audio;
		this.events = events;
		this.aliens = aliens;
		
		// STATIC
		this.cooldown = 1000;
		this.speed = 1;
		this.firingRange = 70;
		this.dodgeRange = 200;

		// VARIABLE
		this.weaponReady = true;
		this.lives = 10;
		this.target = null;

		// DISPLAY
		this.sprite = new Sprite({
			x: (this.canvas.width / 2) - 10,
			y: this.canvas.height - 40,
			color: 'red',
			width: 30,
			height: 20,
			anchor: center,
			dx: 2
		});
		this.missiles = new Pool({
			create: Sprite
		});
		this.sparks = new Pool({
			create: Sprite
		});

		this.updateDisplay();
		this.chooseTarget();
	}

	// FUNCTIONS
	update() {
		this.workOutSpeed();
		this.moveTowardsTarget();
		this.fireMissiles();
		this.playerMissileCollissions();
		this.alienMissileCollissions();
		this.playerMissileDodging();
		this.alienPlayerCollissions();
		this.changeTarget();
		this.hitEdges();

		this.sprite.update();
		this.missiles.update();
		this.sparks.update();
	}
	workOutSpeed() {
		this.speed = this.aliens.speed * 0.8;
	}
	moveTowardsTarget() {
		if (this.sprite.x < this.target.x - 10) {
			this.sprite.dx = this.speed;
		} else if (this.sprite.x > this.target.x + 10) {
			this.sprite.dx = -1 * this.speed;
		} else {
			this.sprite.dx = 0;
		}
	}
	fireMissiles() {
		if ((this.sprite.x > this.target.x - this.firingRange && this.sprite.x < this.target.x * this.firingRange) || chance(100)) {
			if (this.weaponReady === true) {
				this.missiles.get({
					x: this.sprite.x,
					y: this.sprite.y - (this.sprite.height / 2),
					color: 'green',
					width: 5,
					height: 15,
					anchor: center,
					dy: -3,
					ttl: this.canvas.height
				});

				this.audio.play('shot');

				this.weaponReady = false;
				setTimeout(() => {
					this.weaponReady = true;
				}, this.cooldown);
			}
		}
	}
	playerMissileCollissions() {
		this.missiles.getAliveObjects().forEach((missile) => {
			this.aliens.getAlive().forEach((alien) => {
				if (missile.collidesWith(alien)) {
					missile.ttl = 0;

					this.events.emit('ALIEN_KILLED', alien);
				}
			});
		});
	}
	alienMissileCollissions() {
		this.aliens.missiles.getAliveObjects().forEach((missile) => {
			if (missile.collidesWith(this.sprite)) {
				missile.ttl = 0;

				this.events.emit('PLAYER_LOSE_LIFE');
			}
		});
	}
	playerMissileDodging() {
		this.aliens.missiles.getAliveObjects().forEach((missile) => {
			if (missile.y > this.sprite.y - this.dodgeRange && missile.y < this.sprite.y - (this.sprite.height / 2) - (missile.height / 2)) {
				let dodgeSpeed = 3;
				if (this.sprite.y - missile.y < this.sprite.height * 2) {
					dodgeSpeed = 4;
					// this.chooseTarget();
				}

				// if (missile.x > this.sprite.x - (this.sprite.width * 1.5) && missile.x <= this.sprite.x + (this.sprite.width * 1.5)) {
				// 	this.sprite.dx = Math.sign(this.sprite.dx) * this.speed * dodgeSpeed;
				// }

				// if (missile.x > this.sprite.x - (this.sprite.width * 1.5) && missile.y < this.sprite.y) {
				// 	this.sprite.dx = this.speed * dodgeSpeed;
				// } else if (missile.x <= this.sprite.x + (this.sprite.width * 1.5) && missile.y > this.sprite.y) {
				// 	this.sprite.dx = -1 * this.speed * dodgeSpeed;
				// }
			}
		});
	}	
	alienPlayerCollissions() {
		this.aliens.getAlive().forEach((alien) => {
			if (alien.collidesWith(this.sprite)) {
				alien.alive = false;

				this.events.emit('PLAYER_LOSE_LIFE');
			}
		});
	}
	changeTarget() {
		if (!this.target.alive || chance(800)) {
			this.chooseTarget();
		}
	}
	hitEdges()	 {
		if (this.sprite.x > this.canvas.width - this.canvas.gutter - (this.sprite.width / 2)) {
			this.sprite.dx *= -1;
			this.sprite.x = this.canvas.width - this.canvas.gutter - (this.sprite.width / 2);
		}

		if (this.sprite.x < this.canvas.gutter + (this.sprite.width / 2)) {
			this.sprite.dx *= -1;
			this.sprite.x = this.canvas.gutter + (this.sprite.width / 2);
		}
	}
	render() {
		this.sparks.render();
		this.missiles.render();
		this.sprite.render();
	}
	updateDisplay() {
		document.getElementById('playerLives').innerHTML = 'Lives: ' + this.lives;
	}

	// HELPERS
	chooseTarget() {
		this.target = randomFromArray(this.aliens.getLowest());
	}
}

export default Player;
