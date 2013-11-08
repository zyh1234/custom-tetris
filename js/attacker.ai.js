Game.Attacker.AI = function() {
	Game.Attacker.call(this);
	this._interval = null;
	this._lastType = "";
}

Game.Attacker.AI.prototype = Object.create(Game.Attacker.prototype);

Game.Attacker.AI.prototype.setEngine = function(engine) {
	if (this._interval) { 
		clearInterval(this._interval); 
		this._interval = null;
	}
	Game.Attacker.prototype.setEngine.call(this, engine);
	if (this._engine) { 
		this._interval = setInterval(this._poll.bind(this), Game.INTERVAL_ATTACKER);
	}
}

Game.Attacker.AI.prototype._poll = function() {
	var next = this._engine.getNextPiece();
	if (next) { return; }

	var money = this._engine.getStatus().money;
	var avail = Game.Piece.getAvailableTypes(money);
	if (!avail.length) { return; } /* out of money */

	/* remove last used type, if possible */
	var index = avail.indexOf(this._lastType);
	if (index > -1 && avail.length > 1) { avail.splice(index, 1); }

	var pit = this._engine.pit;
	var current = this._engine.getPiece();

	if (current) { /* drop current piece based on its expected position/rotation */
		pit = pit.clone();
		current = current.clone();

		var best = Game.AI.findBestPositionRotation(pit, current);
		for (var i=0;i<best.rotation;i++) { current.rotate(+1); }
		current.xy = new XY(best.x, Game.DEPTH);
		pit.drop(current);
	}

	var scores = Game.AI.scoreTypes(pit, avail);
	var worstScore = -Infinity;
	var worstTypes = [];

	for (var type in scores) {
		var score = scores[type];
		if (score > worstScore) {
			worstScore = score;
			worstTypes = [];
		}
		if (score == worstScore) { worstTypes.push(type); }
	}

	var type = worstTypes.random();
	var piece = new Game.Piece(type);
	this._lastType = type;
	this._engine.setNextPiece(piece);
}
