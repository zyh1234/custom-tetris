Game.Pit = function() {
	this._data = {};
	this._cols = []; /* maximum values per-column */
	this._rows = []; /* non-empty cells per-row */

	for (var i=0;i<Game.WIDTH;i++) { this._cols.push(0); }
	for (var i=0;i<Game.DEPTH;i++) { this._rows.push(0); }
}

Game.Pit.prototype.clone = function() {
	var clone = new this.constructor();
	clone._data = JSON.parse(JSON.stringify(this._data));
	clone._cols = JSON.parse(JSON.stringify(this._cols));
	clone._rows = JSON.parse(JSON.stringify(this._rows));
	return clone;
}

Game.Pit.prototype.getScore = function() {
	/* FIXME */
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
		var xy = piece.xy.plus(part);
		this._data[xy] = piece.color;
		this._rows[xy.y]++;
		this._cols[xy.x] = Math.max(this._cols[xy.x], xy.y+1);
	}, this);

	return this;
}

/**
 * @returns {number} of cleaned rows
 */
Game.Pit.prototype.cleanup = function() {
	var result = 0;

	for (var j=0;j<Game.DEPTH;j++) {
		if (this._rows[j] < Game.WIDTH) { continue; }

		/* remove this row, decrement counter */
		var data = {};
		for (var p in this._data) {
			var xy = XY.fromString(p);
			if (xy.y == j) { continue; }
			if (xy.y > j) { xy = new XY(xy.x, xy.y-1); }
			data[xy] = this._data[p];
		}
		this._data = data;

		this._rows.splice(j, 1);
		this._rows.push(0);

		result++;
		j--;
	}

	this._cols = this._cols.map(function(col) { /* decrement max values */
		return col-result;
	});

	return result;
}
