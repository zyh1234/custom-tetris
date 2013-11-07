Game.Engine = function(options) {
	this._options = {
		money: 10000
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._status = {
		money: this._options.money,
		score: 0,
		playing: true
	}

	this._interval = null;
	this._dropping = false;
	this.pit = new Game.Pit();
	this.pit.build();

	document.body.appendChild(this.pit.node);
	
	this._piece = null;
	this._nextPiece = null;	
}

Game.Engine.prototype.setNextPiece = function(nextPiece) {
	if (nextPiece.price > this._status.money) { return; }

	this._nextPiece = nextPiece;
	this._status.money -= nextPiece.price;

	if (!this._piece) { this._useNextPiece(); }
}

Game.Engine.prototype.getPiece = function() {
	return this._piece;
}

Game.Engine.prototype.getStatus = function() {
	return this._status;
}

Game.Engine.prototype.getNextPiece = function() {
	return this._nextPiece;
}

Game.Engine.prototype.drop = function() {
	if (!this._piece || this._dropping) { return; }

	var gravity = new XY(0, -1);
	while (this._piece.fits(this.pit)) {
		this._piece.xy = this._piece.xy.plus(gravity);
	}
	this._piece.xy = this._piece.xy.minus(gravity);

	this._stop();
	this._dropping = true;
	setTimeout(this._drop.bind(this), Game.INTERVAL_DROP);
}

/**
 * After drop timeout
 */
Game.Engine.prototype._drop = function() {
	this._dropping = false;
	var removed = this.pit.drop(this._piece);
	this._piece = null;
	this._status.score += this._computeScore(removed);
	if (this._nextPiece) { 
		this._useNextPiece(); 
	} else {
		var avail = Game.Piece.getAvailableTypes(this._status.money);
		if (!avail.length) { /* not enough money! */
			this._status.playing = false;
		}
	}
}

Game.Engine.prototype.rotate = function() {
	if (!this._piece || this._dropping) { return; }
	this._piece.rotate(+1);
	if (!this._piece.fits(this.pit)) { this._piece.rotate(-1); }
}

Game.Engine.prototype.shift = function(direction) {
	if (!this._piece || this._dropping) { return; }
	var xy = new XY(direction, 0);
	this._piece.xy = this._piece.xy.plus(xy);
	if (!this._piece.fits(this.pit)) { this._piece.xy = this._piece.xy.minus(xy); }
}

Game.Engine.prototype._useNextPiece = function() {
	this._nextPiece.center();
	this._nextPiece.build(this.pit.node);

	if (!this._nextPiece.fits(this.pit)) { /* game over */
		this._status.playing = false;
		return;
	}

	this._piece = this._nextPiece;
	this._nextPiece = null;
	this._start();
}

Game.Engine.prototype._tick = function() {
	var gravity = new XY(0, -1);
	this._piece.xy = this._piece.xy.plus(gravity);
	if (!this._piece.fits(this.pit)) {
		this._piece.xy = this._piece.xy.minus(gravity);
		this.drop();
	}
}

Game.Engine.prototype._computeScore = function(removed) {
	if (!removed) { return 0; }
	return 100 * (1 << (removed-1));
}

Game.Engine.prototype._start = function() {
	this._interval = setInterval(this._tick.bind(this), Game.INTERVAL_ENGINE);
}

Game.Engine.prototype._stop = function() {
	clearInterval(this._interval);
	this._interval = null;
}
