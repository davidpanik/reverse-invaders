let pressed = '';

function leftPressed() {
	return (pressed === 'left');
}

function rightPressed() {
	return (pressed === 'right');
}


document.addEventListener('keydown', (event) => {
	if (event.keyCode === 37) {
		pressed = 'left';
	}
	if (event.keyCode === 39) {
		pressed = 'right';
	}
});
document.addEventListener('keyup', (event) => {
	if (event.keyCode === 37 || event.keyCode === 39) {
		pressed = '';
	}
});

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
