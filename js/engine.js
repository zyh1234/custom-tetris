Game.Engine = function(options) {
	this._options = {
		interval: 1000
	};
	for (var p in options) { this._options[p] = options[p]; }
	
	this._interval = null;
	this._pit = new Game.Pit();
	this._piece = null;
	this._nextPiece = null;	
	this._score = 0;
}

Game.Engine.prototype.setNextPiece = function(nextPiece) {
	this._nextPiece = nextPiece;
	if (!this._piece) { this._useNextPiece(); }
}

Game.Engine.prototype.getPiece = function() {
	return this._piece;
}

Game.Engine.prototype.getNextPiece = function() {
	return this._nextPiece;
}

Game.Engine.prototype.start = function() {
	this._interval = setInterval(this._tick.bind(this), this._options.interval);
}

Game.Engine.prototype.stop = function() {
	clearInterval(this._interval);
	this._interval = null;
}

Game.Engine.prototype.drop = function() {
	this._pit.drop(this._piece);
	var removed = this._pit.cleanup();
	this._score += this._computeScore(removed);
	/* FIXME render */
	this.stop();
	if (this._nextPiece) { this._useNextPiece(); }
}

Game.Engine.prototype.rotate = function(direction) {
	this._piece.rotate(direction);
	if (this._piece.fits(this._pit)) { /* OK, render */
		/* FIXME */
	} else {
		this._piece.rotate(-direction);
	}
}

Game.Engine.prototype.shift = function(direction) {
	var xy = new XY(direction, 0);
	this._piece.xy = this._piece.xy.plus(xy);
	if (this._piece.fits(this._pit)) { /* OK, render */
		/* FIXME */
	} else {
		this._piece.xy = this._piece.minus(xy);
	}
}

Game.Engine.prototype._useNextPiece = function() {
	this._piece = this._nextPiece;
	this._piece.center();
	this._nextPiece = null;
	/* FIXME render */
	this.start();
}

Game.Engine.prototype._tick = function() {
	var gravity = new XY(0, -1);
	this._piece.xy = this._pixece.xy.plus(gravity);
	if (this._piece.fits(this._pit)) { /* OK, fits -> render */
		/* FIXME */
	} else { /* drop it */
		this._piece.xy = this._piece.minus(xy);
		this.drop();
	}
}

Game.Engine.prototype._computeScore = function(removed) {
	/* FIXME */
	return removed;
}
