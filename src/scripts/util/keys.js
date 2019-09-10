let pressed = {
	left: false,
	right: false
};

function leftPressed() {
	return pressed.left;
}

function rightPressed() {
	return pressed.right;
}


document.addEventListener('keydown', (event) => {
	if (event.keyCode === 37) {
		pressed.left = true;
	}
	if (event.keyCode === 39) {
		pressed.right = true;
	}
});
document.addEventListener('keyup', (event) => {
	if (event.keyCode === 37) {
		pressed.left = false;
	}
	if (event.keyCode === 39) {
		pressed.right = false;
	}
});

document.getElementById('leftButton').addEventListener('mousedown', () => {
	pressed.left = true;
});
document.getElementById('leftButton').addEventListener('mouseup', () => {
	pressed.left = false;
});

document.getElementById('rightButton').addEventListener('mousedown', () => {
	pressed.right = true;
});
document.getElementById('rightButton').addEventListener('mouseup', () => {
	pressed.right = false;
});

export { leftPressed, rightPressed };
