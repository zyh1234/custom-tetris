Game.Engine = function() {
	this._status = {
		score: 0,
		playing: true
	}
	this._setScore(0);
	this._setPlaying(true);

	this._interval = null;
	this._dropping = false;
	this._availableTypes = {};

	this.gallery = new Game.Gallery(this);
	this.pit = new Game.Pit();
	this.pit.build();

	document.querySelector("#left").appendChild(this.pit.node);
	document.querySelector("#right").appendChild(this.gallery.node);
	
	this._piece = null;
	this._nextPiece = null;
	this._refreshAvailable();
	this.gallery.sync();
}

Game.Engine.prototype.setNextPiece = function(nextPiece) {
	var type = nextPiece.type;
	var avail = this._availableTypes[type] || 0;
	if (avail < 1) { return; }

	this._nextPiece = nextPiece;
	if (!this._piece) { 
		this._useNextPiece(); 
	} else {
		this.gallery.sync();
	}
	return this;
}

Game.Engine.prototype.getAvailableTypes = function() {
	return this._availableTypes;
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
	return this;
}

Game.Engine.prototype.rotate = function() {
	if (!this._piece || this._dropping) { return; }
	this._piece.rotate(+1);
	if (!this._piece.fits(this.pit)) { this._piece.rotate(-1); }
	return this;
}

Game.Engine.prototype.shift = function(direction) {
	if (!this._piece || this._dropping) { return; }
	var xy = new XY(direction, 0);
	this._piece.xy = this._piece.xy.plus(xy);
	if (!this._piece.fits(this.pit)) { this._piece.xy = this._piece.xy.minus(xy); }
	return this;
}

/**
 * After drop timeout
 */
Game.Engine.prototype._drop = function() {
	this._dropping = false;
	var removed = this.pit.drop(this._piece);
	this._piece = null;
	this._setScore(this._status.score + this._computeScore(removed));
	if (this._nextPiece) { this._useNextPiece(); }
}


Game.Engine.prototype._refreshAvailable = function() {
	for (var type in Game.Piece.DEF) {
		this._availableTypes[type] = Game.Piece.DEF[type].avail;
	}
}

Game.Engine.prototype._useNextPiece = function() {
	var type = this._nextPiece.type;
	var avail = this._availableTypes[type]-1;
	if (avail) {
		this._availableTypes[type] = avail;
	} else {
		delete this._availableTypes[type];
	}
	if (!Object.keys(this._availableTypes).length) { this._refreshAvailable(); }
	
	this._nextPiece.center();
	this._nextPiece.build(this.pit.node);

	if (this._nextPiece.fits(this.pit)) {
		this._piece = this._nextPiece;
		this._nextPiece = null;
		this._start();
	} else { /* game over */
		this._setPlaying(false);
	}

	this.gallery.sync();
}

Game.Engine.prototype._setScore = function(score) {
	this._status.score = score;
	document.querySelector("#score").innerHTML = score;
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

Game.Engine.prototype._setPlaying = function(playing) {
	this._status.playing = playing;
	document.querySelector("#status").innerHTML = (playing ? "Playing" : "GAME OVER");
}

Game.Engine.prototype._start = function() {
	this._interval = setInterval(this._tick.bind(this), Game.INTERVAL_ENGINE);
}

Game.Engine.prototype._stop = function() {
	clearInterval(this._interval);
	this._interval = null;
}
