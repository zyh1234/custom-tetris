Game.Attacker.Human = function() {
	Game.Attacker.call(this);
	this._interval = null;
}

Game.Attacker.Human.prototype = Object.create(Game.Attacker.prototype);

Game.Attacker.Human.prototype.setEngine = function(engine) {
	if (this._engine) {
		document.body.classList.remove("attacker-human");
		document.body.removeEventListener("click", this);
		window.removeEventListener("keydown", this);
	}
	Game.Attacker.prototype.setEngine.call(this, engine);
	if (this._engine) { 
		document.body.classList.add("attacker-human");
		document.body.addEventListener("click", this);
		window.addEventListener("keydown", this);
	}
}

Game.Attacker.Human.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			var node = e.target;
			var type = null;
			while (node != document.body) {
				if (node.hasAttribute("data-type")) { type = node.getAttribute("data-type"); }
				node = node.parentNode;
			}
			this._tryType(type);
		break;
		
		case "keydown":
			var index = e.keyCode - "1".charCodeAt(0);
			if (index == -1) { index = 9; }
			var types = Object.keys(Game.Piece.DEF);
			if (index >= 0 && index < types.length) {
				this._tryType(types[index]);
			}
		break;
	}
}

Game.Attacker.Human.prototype._tryType = function(type) {
	var status = this._engine.getStatus();
	var piece = new Game.Piece(type);
	if (piece.price > status.money) { return; }
	this._engine.setNextPiece(piece);
}
