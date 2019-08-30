setInterval(() => {
	let canvas = document.getElementById('ghostCanvas');
	let context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(document.getElementById('mainCanvas'), 0, 0);
}, 500);
