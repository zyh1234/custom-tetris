Game.Cell = function(xy, color) {
	this._xy = xy;
	this._color = color;
	this.node = null;
}

Game.Cell.prototype.setXY = function(xy) {
	this._xy = xy;
	if (this.node) { this._position(); }
	return this;
}

Game.Cell.prototype.getXY = function() {
	return this._xy;
}

Game.Cell.prototype.build = function(parent) {
	this.node = document.createElement("div");
	this.node.className = "cell";
	this.node.style.width = Game.CELL + "px";
	this.node.style.height = Game.CELL + "px";
	this.node.style.backgroundColor = this._color;
	this._position();
	parent.appendChild(this.node);
	return this;
}

Game.Cell.prototype.clone = function() {
	var clone = new this.constructor(this._xy, this._color);
	return this;
}

Game.Cell.prototype._position = function() {
	this.node.style.left = (this._xy.x * Game.CELL) + "px";
	this.node.style.bottom = (this._xy.y * Game.CELL) + "px";
	return this;
}