function scale() {
	let screen = document.getElementById('screen');
	let screenPercentage = 0.9;

	let canvasWidth = screen.offsetWidth;
	let canvasHeight = screen.offsetHeight;
	let screenWidth = window.innerWidth * screenPercentage;
	let screenHeight = window.innerHeight * screenPercentage;

	let widthScale = screenWidth / canvasWidth;
	let heightScale = screenHeight / canvasHeight;

	screen.style.transform = `scale(${widthScale > heightScale ? heightScale : widthScale})`;
}

scale();
window.addEventListener('resize', scale, false);
