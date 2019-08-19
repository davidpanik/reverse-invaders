function chance(n) {
	return (random(n) === 0);
}

function random(r1, r2, r3) {
	let min = 0;
	let max = 0;
	let interval = 1;
	let result;

	if (typeof (r1) !== 'undefined') {
		min = 0;
		max = r1;
	}

	if (typeof (r2) !== 'undefined') {
		min = r1;
		max = r2;
	}

	if (typeof (r3) !== 'undefined') {
		interval = r3;
	}

	result = Math.floor(Math.random() * (max - min)) + min;

	if (interval > 1) {
		result = Math.round(result / interval) * interval;
	}

	return result;
}

export { chance, random };
