import { initKeys, keyPressed } from './vendor/kontra';

initKeys();

let pressed = '';
function leftPressed() {
	return (keyPressed('left') || pressed === 'left');
}

function rightPressed() {
	return (keyPressed('right') || pressed === 'right');
}

document.getElementById('leftButton').addEventListener('mousedown', () => {
	pressed = 'left';
});
document.getElementById('leftButton').addEventListener('mouseup', () => {
	pressed = '';
});

document.getElementById('rightButton').addEventListener('mousedown', () => {
	pressed = 'right';
});
document.getElementById('rightButton').addEventListener('mouseup', () => {
	pressed = '';
});

export { leftPressed, rightPressed };
