import { Sprite, Pool } from './vendor/kontra';
import { chance, random, randomFromArray } from './random';

const center = {
	x: 0.5,
	y: 0.5
};

export default function createPlayer(canvas, audio, events, aliens) {
	let player = {
		// STATIC
		cooldown: 1000,
		speed: 1,
		firingRange: 70,
		dodgeRange: 200,

		// VARIABLE
		weaponReady: true,
		lives: 10,
		target: null,

		// DISPLAY
		sprite: new Sprite({
			x: (canvas.width / 2) - 10,
			y: canvas.height - 40,
			color: 'red',
			width: 30,
			height: 20,
			anchor: center,
			dx: 2
		}),
		missiles: new Pool({
			create: Sprite
		}),
		sparks: new Pool({
			create: Sprite
		}),

		// FUNCTIONS
		update: function () {
			this.speed = aliens.speed * 0.8;

			if (this.sprite.x < this.target.x) {
				this.sprite.dx = this.speed;
			} else if (this.sprite.x > this.target.x) {
				this.sprite.dx = -1 * this.speed;
			} else {
				this.sprite.dx = 0;
			}

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
						ttl: canvas.height
					});

					audio.play('playerShoot');

					this.weaponReady = false;
					setTimeout(() => {
						this.weaponReady = true;
					}, this.cooldown);
				}
			}

			this.missiles.getAliveObjects().forEach((missile) => {
				aliens.getAlive().forEach((alien) => {
					if (missile.collidesWith(alien)) {
						alien.alive = false;
						missile.ttl = 0;

						createSparks(aliens, alien, 'red');
					}
				});
			});

			aliens.missiles.getAliveObjects().forEach((missile) => {
				if (missile.collidesWith(this.sprite)) {
					missile.ttl = 0;
					this.lives -= 1;

					this.updateDisplay();

					createSparks(this, this.sprite, 'green');

					if (this.lives <= 0) {
						alert('YOU WIN');
						window.location = window.location;
					}
				} else {
					if (missile.y > this.sprite.y - this.dodgeRange && missile.y < this.sprite.y - (this.sprite.height / 2) - (missile.height / 2)) {
						let dodgeSpeed = 3;
						if (this.sprite.y - missile.y < this.sprite.height * 2) {
							dodgeSpeed = 4;
							// this.chooseTarget();
						}

						// if (missile.x > this.sprite.x - (this.sprite.width * 1.5) && missile.x <= this.sprite.x + (this.sprite.width * 1.5)) {
						// 	this.sprite.dx = Math.sign(this.sprite.dx) * this.speed * dodgeSpeed;
						// }

						if (missile.x > this.sprite.x - (this.sprite.width * 1.5) && missile.y < this.sprite.y) {
							this.sprite.dx = this.speed * dodgeSpeed;
						} else if (missile.x <= this.sprite.x + (this.sprite.width * 1.5) && missile.y > this.sprite.y) {
							this.sprite.dx = -1 * this.speed * dodgeSpeed;
						}
					}
				}
			});

			aliens.getAlive().forEach((alien) => {
				if (alien.collidesWith(this.sprite)) {
					this.lives -= 1;
					alien.alive = false;

					this.updateDisplay();

					if (this.lives <= 0) {
						alert('YOU WIN');
						window.location = window.location;
					}
				}
			});

			if (!this.target.alive || chance(800)) {
				this.chooseTarget();
			}

			// Bounce on edges
			if (this.sprite.x > canvas.width - canvas.gutter - (this.sprite.width / 2)) {
				this.sprite.dx *= -1;
				this.sprite.x = canvas.width - canvas.gutter - (this.sprite.width / 2);
			}
			
			if (this.sprite.x < canvas.gutter + (this.sprite.width / 2)) {
				this.sprite.dx *= -1;
				this.sprite.x = canvas.gutter + (this.sprite.width / 2);
			}

			this.sprite.update();
			this.missiles.update();
			this.sparks.update();
		},
		render: function () {
			this.sparks.render();
			this.missiles.render();
			this.sprite.render();
		},
		updateDisplay: function() {
			document.getElementById('playerLives').innerHTML = 'Lives: ' + this.lives;
		},

		// HELPERS
		chooseTarget: function() {
			this.target = randomFromArray(aliens.getLowest());
		}
	};
	
	player.updateDisplay();
	player.chooseTarget();

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
	
	return player;
}
