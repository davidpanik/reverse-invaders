export default function isMonetized() {
	return (document.monetization && document.monetization.state === 'started');
}
