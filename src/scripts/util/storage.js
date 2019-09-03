class Storage {
	constructor() {

	}

	set(key, value) {
		if (window.localStorage) {
			window.localStorage.setItem(key, value);
		}
	}

	get(key) {
		if (window.localStorage) {
			return window.localStorage.getItem(key);
		}
	}
}

export default Storage;
