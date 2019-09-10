import Sprite from '../util/sprite';
import Spritesheet from '../util/spritesheet';
import { chance, randomFromArray } from '../util/random';
import Pool from '../util/pool';
import { colorYellow } from './colors';
import center from '../util/center';


function getDistance(x1, y1, x2, y2) {
	let xDiff = x1 - x2;
	let yDiff = y1 - y2;

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

class Player {
	constructor(canvas, context, audio, events, aliens) {
		this.canvas = canvas;
		this.context = context;
		this.audio = audio;
		this.events = events;
		this.aliens = aliens;
		
		// STATIC
		this.cooldown = 1800;
		this.speed = 1;
		this.firingRange = 70;
		this.dodgeRange = 50;
		this.rechargeTime = 2000;
		this.invincibilityTime = 4000;

		// VARIABLE
		this.weaponReady = true;
		this.lives = 5;
		this.target = null;
		this.recharging = false;
		this.invincible = false;

		// DISPLAY
		this.sprite = new Sprite({
			context: this.context,
			x: (this.canvas.width / 2) - 10,
			y: this.canvas.height - 40,
			// color: 'purple',
			width: 40,
			height: 27,
			anchor: center,
			spritesheet: new Spritesheet('/images/player.png', 4),
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
		if (!this.recharging) {
			this.workOutSpeed();
			this.moveTowardsTarget();
			this.fireMissiles();
			// if (!chance(4)) {
				this.playerMissileDodging();
			// }
			this.changeTarget();
			this.hitEdges();
		} else {
			this.sprite.dx = 0;
		}

		if (!this.invincible) {
			this.alienMissileCollissions();
			this.alienPlayerCollissions();
		}

		this.playerMissileCollissions();

		this.sprite.update();
		this.missiles.update();
		this.sparks.update();
	}
	workOutSpeed() {
		this.speed = this.aliens.speed * 0.8;
	}
	moveTowardsTarget() {
		const margin = 10;

		if (this.sprite.x < this.target.x - margin) {
			this.sprite.dx = this.speed;
		} else if (this.sprite.x > this.target.x + margin) {
			this.sprite.dx = -1 * this.speed;
		} else {
			this.sprite.dx = 0;
		}
	}
	fireMissiles() {
		if ((this.sprite.x > this.target.x - this.firingRange && this.sprite.x < this.target.x * this.firingRange) || chance(100)) {
			if (this.weaponReady === true) {
				this.missiles.get({
					context: this.context,
					x: this.sprite.x,
					y: this.sprite.y - (this.sprite.height / 2),
					color: colorYellow,
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
			if (missile.y > this.sprite.y - this.dodgeRange && missile.y < this.canvas.height) { // Missile is getting close
				let distance = getDistance(missile.x, missile.y + missile.dy, this.sprite.x + this.sprite.dx, this.sprite.y);

				if (missile.x > this.sprite.x - 20 && missile.x < this.sprite.x) { // If missile is oncoming dodge right
					this.sprite.dx = 2;
				} else if (missile.x < this.sprite.x + 20 && missile.x >= this.sprite.x) { // If missile is oncoming dodge left
					this.sprite.dx = -2;
				} else if (distance < 30) { // If moving towards impact with a missile, change direction
					if (this.sprite.x < missile.x) {
						this.sprite.dx = -2;
					} else {
						this.sprite.dx = 2;
					}
				} else if (this.sprite.dx !== 0 && distance < 50) { // If continuing would crash into a missile, stop
					this.sprite.dx = 0;
				}
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
		let date = new Date();
		if (!this.invincible || date.getMilliseconds() / 100 < 5) {
			this.sprite.render();
		}
	}
	updateDisplay() {
		document.getElementById('playerLives').innerHTML = 'Lives:' + this.lives;
	}

	// HELPERS
	chooseTarget() {
		if (chance(2)) {
			this.target = randomFromArray(this.aliens.getLowest()); // Choose a random target
		} else {
			this.target = this.aliens.getLowest().sort((alpha, beta) => {
				let alphaDistance = Math.abs(alpha.x - this.sprite.x);
				let betaDistance = Math.abs(beta.x - this.sprite.x);
				return (alphaDistance > betaDistance) ? 1 : (betaDistance > alphaDistance) ? -1 : 0;
			})[0]; // Choose the nearest target
		}
	}
	respawn() {
		this.sprite.x = this.canvas.width / 2;
		this.sprite.dx = 0;
		this.chooseTarget();
		this.recharging = true;
		this.invincible = true;

		setTimeout(() => {
			this.recharging = false;
		}, this.rechargeTime);

		setTimeout(() => {
			this.invincible = false;
		}, this.invincibilityTime);
	}
}

export default Player;
