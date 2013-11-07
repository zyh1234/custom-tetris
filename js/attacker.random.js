Game.Attacker.Random = function() {
	Game.Attacker.call(this);
	this._interval = null;
}

Game.Attacker.Random.prototype = Object.create(Game.Attacker.prototype);

Game.Attacker.Random.prototype.setEngine = function(engine) {
	if (this._interval) { 
		clearInterval(this._interval); 
		this._interval = null;
	}
	Game.Attacker.prototype.setEngine.call(this, engine);
	if (this._engine) { 
		this._interval = setInterval(this._poll.bind(this), Game.INTERVAL_ATTACKER);
	}
}

Game.Attacker.Random.prototype._poll = function() {
	var next = this._engine.getNextPiece();
	if (next) { return; }

	var type = Object.keys(Game.Piece.DEF).random();

	var piece = Game.Piece.create(type);
	this._engine.setNextPiece(piece);
}
