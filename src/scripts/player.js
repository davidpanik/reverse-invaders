import { Sprite, Pool } from './vendor/kontra';
import { chance } from './random';

const center = {
	x: 0.5,
	y: 0.5
};

export default function createPlayer(canvas, audio, aliens) {
	let player = {
		// STATIC
		cooldown: 1000,

		// VARIABLE
		weaponReady: true,
		lives: 10,

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
			if (chance(40)) {
				this.sprite.dx *= -1;
			}
			// Bounce on edges
			else if (this.sprite.x > canvas.width - canvas.gutter - (this.sprite.width / 2) || this.sprite.x < canvas.gutter + (this.sprite.width / 2)) {
				this.sprite.dx *= -1;
			}

			if (chance(50)) {
				if (this.weaponReady) {
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
					}, this.Cooldown);
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

			this.sprite.update();
			this.missiles.update();
		},
		render: function () {
			this.sprite.render();
			this.missiles.render();
		},
		updateDisplay: function() {
			document.getElementById('playerLives').innerHTML = this.lives;
		}
	};
	
	player.updateDisplay();

	return player;
}
