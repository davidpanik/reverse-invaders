function scale() {
	let screen = document.getElementById('screen');
	let margin = 100;

	let canvasWidth = screen.offsetWidth;
	let canvasHeight = screen.offsetHeight;
	let screenWidth = window.innerWidth - margin;
	let screenHeight = window.innerHeight - margin;

	let widthScale = screenWidth / canvasWidth;
	let heightScale = screenHeight / canvasHeight;

	screen.style.transform = `scale(${widthScale > heightScale ? heightScale : widthScale})`;
}

scale();
window.addEventListener('resize', scale, false);
