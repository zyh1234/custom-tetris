Game.Cell = function(xy, color) {
	this.xy = xy;
	this._color = color;
	this.node = null;
}

Object.defineProperty(Game.Cell.prototype, "xy", {
	get: function() {
		return this._xy;
	},

	set: function(xy) {
		this._xy = xy;
		if (this.node) { this._position(); }
	}
});

Game.Cell.prototype.build = function(parent) {
	this.node = document.createElement("div");
	this.node.classList.add("cell");
	this.node.style.width = Game.CELL + "px";
	this.node.style.height = Game.CELL + "px";
	this.node.style.backgroundColor = this._color;
	this._position();
	parent.appendChild(this.node);
	return this;
}

Game.Cell.prototype.clone = function() {
	return new Game.Cell(this.xy, this._color);
}

Game.Cell.prototype._position = function() {
	this.node.style.left = (this.xy.x * Game.CELL) + "px";
	this.node.style.bottom = (this.xy.y * Game.CELL) + "px";
	return this;
}
