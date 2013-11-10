Game.App = function() {
	this._engine = null;
	this._attacker = null;
	this._defender = null;
	this._select = {
		attacker: document.querySelector("#attacker select"),
		defender: document.querySelector("#defender select")
	}
	this._select.attacker.value = "Random";
	this._select.defender.value = "AI";
	this._select.attacker.addEventListener("change", this);
	this._select.defender.addEventListener("change", this);

//	this._start();
}

Game.App.prototype.handleEvent = function(e) {
	e.target.blur();
	if (this._engine) {
		if (e.target == this._select.attacker) { this._createAttacker(e.target.value); }
		if (e.target == this._select.defender) { this._createDefender(e.target.value); }
	}
}

Game.App.prototype._start = function() {
	document.querySelector("#setup").classList.add("playing");
	if (this._engine) { this._engine.destroy(); }
	
	document.querySelector("#left").appendChild(document.querySelector("#defender"));
	document.querySelector("#right").appendChild(document.querySelector("#attacker"));
	
	this._engine = new Game.Engine();
	this._createDefender(this._select.defender.value);
	this._createAttacker(this._select.attacker.value);
}

Game.App.prototype._createDefender = function(defender) {
	if (this._defender) { this._defender.destroy(); }
	this._defender = this._createPlayer(defender, Game.Defender);
}

Game.App.prototype._createAttacker = function(attacker) {
	if (this._attacker) { this._attacker.destroy(); }
	this._attacker = this._createPlayer(attacker, Game.Attacker);
}

Game.App.prototype._createPlayer = function(type, namespace) {
	return new namespace[type](this._engine);
}
