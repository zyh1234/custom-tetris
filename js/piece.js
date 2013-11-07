Game.Piece = function(type) {
	var def = this.constructor.DEF[type];
	if (!def) { throw new Error("Piece '" + type + "' does not exist"); }

	this.type = type;
	this.xy = new XY();
	this.price = def.price;
	this.node = null;
	this.cells = {};

	def.cells.forEach(function(xy) {
		var cell = new Game.Cell(xy, def.color);
		this.cells[xy] = cell;
	}, this);
}

Game.Piece.DEF = {
	"o": {
		color: "#4900ff",
		price: 100,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(0, -1), new XY(-1, -1)]
	},
	"i": {
		color: "#0092ff",
		price: 100,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(1, 0), new XY(-2, 0)]
	},
	"s": {
		color: "#00ff92",
		price: 80,
		cells: [new XY(0, 0), new XY(1, 0), new XY(0, -1), new XY(-1, -1)]
	},
	"z": {
		color: "#ff00db",
		price: 80,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(0, -1), new XY(1, -1)]
	},
	"l": {
		color: "#49ff00",
		price: 80,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(1, 0), new XY(-1, -1)]
	},
	"j": {
		color: "#ff0000",
		price: 80,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(1, 0), new XY(1, -1)]
	},
	"t": {
		color: "#ffdb00",
		price: 80,
		cells: [new XY(0, 0), new XY(-1, 0), new XY(1, 0), new XY(0, -1)]
	}
}

/**
 * Return all types that are available for a given price
 */
Game.Piece.getAvailableTypes = function(price) {
	var result = [];
	for (var type in this.DEF) {
		if (this.DEF[type].price <= price) { result.push(type); }
	}
	return result;
}

Object.defineProperty(Game.Piece.prototype, "xy", {
	get: function() {
		return this._xy;
	},

	set: function(xy) {
		this._xy = xy;
		if (this.node) { this._position(); }
	}
});


Game.Piece.prototype.toString = function() {
	return Object.keys(this.cells).join(";");
}


Game.Piece.prototype.build = function(parent) {
	this.node = document.createElement("div");
	this.node.classList.add("piece");
	for (var p in this.cells) { this.cells[p].build(this.node); }
	this._position();
	parent.appendChild(this.node);
	return this;
}

Game.Piece.prototype.fits = function(pit) {
	for (var p in this.cells) {
		var xy = this.cells[p].xy.plus(this.xy);

		if (xy.x < 0 || xy.x >= Game.WIDTH) { return false; }
		if (xy.y < 0) { return false; }
		if (pit.cells[xy]) { return false; }
	}

	return true;
}

Game.Piece.prototype.rotate = function(direction) {
	var sign = (direction > 0 ? new XY(-1, 1) : new XY(1, -1));
	var newCells = {};

	for (var p in this.cells) {
		var cell = this.cells[p];
		var xy = cell.xy;
		var nxy = new XY(xy.y*sign.x, xy.x*sign.y);
		cell.xy = nxy;
		newCells[nxy] = cell;
	}
	this.cells = newCells;

	return this;
}

Game.Piece.prototype.center = function() {
	this.xy = new XY(Game.WIDTH/2, Game.DEPTH-1);
	return this;
}

Game.Piece.prototype.clone = function() {
	var clone = new this.constructor(this.type);

	clone.xy = this.xy;
	clone.cells = {};
	for (var p in this.cells) {
		clone.cells[p] = this.cells[p].clone();
	}

	return clone;
}

Game.Piece.prototype._position = function() {
	this.node.style.left = (this.xy.x * Game.CELL) + "px";
	this.node.style.bottom = (this.xy.y * Game.CELL) + "px";
	return this;
}
