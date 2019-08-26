import { Sprite, Pool } from './vendor/kontra';
import { chance, randomFromArray } from './random';

const center = {
	x: 0.5,
	y: 0.5
};

export default function createPlayer(canvas, audio, aliens) {
	let player = {
		// STATIC
		cooldown: 1000,
		speed: 1,
		firingRange: 70,

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

		// FUNCTIONS
		update: function () {
			if (this.sprite.x < this.target.x) {
				this.sprite.dx = this.speed;
			} else if (this.sprite.x > this.target.x) {
				this.sprite.dx = -1 * this.speed;
			} else {
				this.sprite.dx = 0;
			}

			// Bounce on edges
			if (this.sprite.x > canvas.width - canvas.gutter - (this.sprite.width / 2) || this.sprite.x < canvas.gutter + (this.sprite.width / 2)) {
				this.sprite.dx *= -1;
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
					}
				});
			});

			aliens.missiles.getAliveObjects().forEach((missile) => {
				if (missile.collidesWith(this.sprite)) {
					missile.ttl = 0;
					this.lives -= 1;

					this.updateDisplay();

					if (this.lives <= 0) {
						alert('YOU WIN');
						window.location = window.location;
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

			this.sprite.update();
			this.missiles.update();
		},
		render: function () {
			this.sprite.render();
			this.missiles.render();
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

	return player;
}
