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

function addEvents(element, events, callback) {
	events.forEach((event) => {
		element.addEventListener(event, callback);
	});
}

let mobileLeft = document.getElementById('leftButton');
let mobileRight = document.getElementById('rightButton');

addEvents(mobileLeft, ['mousedown', 'touchstart'], () => { pressed.left = true; });
addEvents(mobileLeft, ['mouseup', 'touchend', 'touchcancel'], () => { pressed.left = false; });

addEvents(mobileRight, ['mousedown', 'touchstart'], () => { pressed.right = true; });
addEvents(mobileRight, ['mouseup', 'touchend', 'touchcancel'], () => { pressed.right = false; });

export { leftPressed, rightPressed };
