Game.Defender.Human = function() {
	Game.Defender.call(this);
}

Game.Defender.Human.prototype = Object.create(Game.Defender.prototype);

Game.Defender.Human.prototype.setEngine = function(engine) {
	if (this._engine) { window.removeEventListener("keydown", this); }
	Game.Defender.prototype.setEngine.call(this, engine);
	if (this._engine) { window.addEventListener("keydown", this); }
}

Game.Defender.Human.prototype.handleEvent = function(e) {
	switch (e.keyCode) {
		case 37: /* left */
			this._engine.shift(-1);
		break;

		case 39: /* right */
			this._engine.shift(+1);
		break;

		case 38: /* top */
			this._engine.rotate();
		break;

		case 40: /* bottom */
			this._engine.drop();
		break;
	}
}
