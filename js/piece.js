Game.Piece = function(parts, color, xy) {
	this.parts = parts;
	this.color = color || "red";
	this.xy = xy || new XY();
}

Game.Piece.create = function(type, color, xy) {
	var defs = {
		"o": [new XY(0, 0), new XY(-1, 0), new XY(0, -1), new XY(-1, -1)],
		"i": [new XY(0, 0), new XY(-1, 0), new XY(1, 0), new XY(-2, 0)]
	}

	var def = defs[type];
	if (!def) { throw new Error("Piece '" + type + "' does not exist"); }
	return new this(def, color, xy);
}

Game.Piece.prototype.toString = function() {
	return this.parts.map(function(part) { return part.toString(); }).join(";");
}

Game.Piece.prototype.fits = function(pit) {
	return this.parts.every(function(part) {
		var xy = this.xy.plus(part);

		if (xy.x < 0 || xy.x >= Game.WIDTH) { return false; }
		if (xy.y < 0) { return false; }
		if (pit.at(xy)) { return false; }

		return true;
	}, this);
}

Game.Piece.prototype.rotate = function(direction) {
	var sign = (direction > 0 ? new XY(-1, 1) : new XY(1, -1));
	this.parts = this.parts.map(function(part) {
		return new XY(part.y*sign.x, part.x*sign.y);
	});
	return this;
}

Game.Piece.prototype.center = function() {
	this.xy = new XY(Game.WIDTH/2, Game.DEPTH-1);
	return this;
}

Game.Piece.prototype.clone = function() {
	var clone = new this.constructor();
	clone.parts = JSON.parse(JSON.stringify(this.parts));
	clone.color = JSON.parse(JSON.stringify(this.color));
	clone.xy = this.xy.clone();
	return clone;
}

Game.Piece.prototype.getSize = function(prop) {
	var min = Infinity;
	var max = -Infinity;
	this.parts.forEach(function(part) {
		min = Math.min(min, part[prop]);
		max = Math.max(max, part[prop]);
	});
	return max-min+1;
}
