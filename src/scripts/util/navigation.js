class Navigation {
	constructor(current = '') {
		this.current = current;
	}

	go(id) {
		this.current = id;

		document.getElementById('screen').setAttribute('class', this.current);
	}
}

export default Navigation;
