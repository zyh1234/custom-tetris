Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}

var Game = {
	DEPTH: 20,
	WIDTH: 10,
	CELL: 25,
	Attacker: {},
	Defender: {}
}
