Game.Engine.Network = function(firebase) {
	this._firebase = firebase;
	this._firebase.on("value", this._change.bind(this));
	Game.Engine.call(this);
}
Game.Engine.Network.prototype = Object.create(Game.Engine.prototype);

Game.Engine.Network.prototype._change = function(snap) {
	var data = snap.val();
	if (!data) { return; }

	if ("pit" in data) { this._syncPit(data.pit) }
	if ("avail" in data) { this._syncAvailablePieces(data.avail); }
	if ("piece" in data) { this._syncPiece(data.piece); }
	if ("nextPiece" in data) { this._syncNextPiece(data.next); }
	if ("drop" in data) { this._syncDrop(data.drop); }
	if ("status" in data) { this._syncStatus(data.status); }
}

Game.Engine.Network.prototype.setNextPiece = function(nextPiece, doNotSend) {
	Game.Engine.prototype.setNextPiece.call(this, nextPiece);	
	if (doNotSend) { return this; }

	if (this._nextPiece) { /* waiting, propagate upwards */
		this._send("next", "avail");
	} else { /* next piece got transformed into piece */
		this._send("next", "piece", "avail");
	}
}

Game.Engine.Network.prototype.drop = function(doNotSend) {
	if (!this._piece || this._dropping) { return; }

	if (!doNotSend) { /* send with OLD piece position so the remote side gets correct piece pos */
		this._dropping = true; /* fake this for correct "drop" value */
		this._send("piece", "drop");
		this._dropping = false;
	}

	Game.Engine.prototype.drop.call(this);	
	return this;
}

Game.Engine.Network.prototype.rotate = function() {
	Game.Engine.prototype.rotate.call(this);	
	this._send("piece");
	return this;
}

Game.Engine.Network.prototype.shift = function(direction) {
	Game.Engine.prototype.shift.call(this, direction);	
	this._send("piece");
	return this;
}

Game.Engine.Network.prototype._drop = function() {
	Game.Engine.prototype._drop.call(this);
	this._send("pit", "piece", "next", "avail", "drop", "status");
}

Game.Engine.Network.prototype._send = function() {
	var data = {};
	for (var i=0;i<arguments.length;i++) {
		switch (arguments[i]) {
			case "pit":
				data.pit = this.pit.toJSON();
			break;

			case "drop":
				data.drop = this._dropping;
			break;

			case "piece":
				data.piece = (this._piece ? this._piece.toJSON() : null);
			break;

			case "next":
				data.next = (this._nextPiece ? this._nextPiece.toJSON() : null);
			break;

			case "avail":
				data.avail = this._availableTypes;
			break;

			case "status":
				data.status = this._status;
			break;
		}
	}
	this._firebase.update(data);
}

Game.Engine.Network.prototype._syncPit = function(remotePit) {
	this.pit.fromJSON(remotePit);
}

Game.Engine.Network.prototype._syncAvailablePieces = function(remoteAvail) {
	this._availableTypes = remoteAvail;
	this.gallery.sync();
}

Game.Engine.Network.prototype._syncPiece = function(remotePiece) {
	if (remotePiece) {
		if (!this._piece) {
			var piece = new Game.Piece(remotePiece.type);
			this._piece = piece;
			this._piece.build(this.pit.node);
			this._start();
		}
		this._piece.fromJSON(remotePiece);
	} else if (this._piece) {
		this._stop();
		this._piece.destroy();
		this._piece = null;
	}
}

Game.Engine.Network.prototype._syncNextPiece = function(remoteNextPiece) {
	if (remoteNextPiece) {
		var piece = new Game.Piece(remoteNextPiece);
		this.setNextPiece(piece, true);
	} else {
		this._nextPiece = null;
	}
	this.gallery.sync();
}

Game.Engine.Network.prototype._syncDrop = function(remoteDrop) {
	if (remoteDrop == this._dropping) { return; }
	if (remoteDrop) { /* remote side started dropping */
		this.drop(true);
	} else { /* remote side ended dropping, ignore (we will do this ourselves) */

	}
}

Game.Engine.Network.prototype._syncStatus = function(remoteStatus) {
	this._setScore(remoteStatus.score);
	this._setPlaying(remoteStatus.playing)
}
