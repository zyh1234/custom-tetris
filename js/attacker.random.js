Game.Attacker.Random = function(engine) {
	Game.Player.call(this, engine);
	this._interval = setInterval(this._poll.bind(this), Game.INTERVAL_ATTACKER);
}

Game.Attacker.Random.prototype = Object.create(Game.Player.prototype);

Game.Attacker.Random.prototype.destroy = function() {
	clearInterval(this._interval); 
	this._interval = null;
	Game.Player.prototype.destroy.call(this);
}

Game.Attacker.Random.prototype._poll = function() {
	var next = this._engine.getNextPiece();
	if (next) { return; }

	var type = Object.keys(Game.Piece.DEF).random();

	var piece = new Game.Piece(type);
	this._engine.setNextPiece(piece);
}
