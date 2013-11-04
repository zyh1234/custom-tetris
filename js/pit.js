Game.Pit = function() {
	this._data = {};
}

Game.Pit.prototype.clone = function() {
	var clone = new this.constructor();
	clone._data = JSON.parse(JSON.stringify(this._data));
}

Game.Pit.prototype.getScore = function() {

}

Game.Pit.prototype.at = function(xy) {
	return this._data[xy] || null;
}

Game.Pit.prototype.drop = function(piece) {
	var gravity = new XY(0, -1);
	while (piece.fits(this)) {
		piece.xy = piece.xy.plus(gravity);
	}
	piece.xy = piece.xy.minus(gravity);

	piece.parts.forEach(function(part) {
		this._data[part.plus(piece.xy)] = piece.color;
	}, this);
}
