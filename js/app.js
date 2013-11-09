Game.App = function() {
	this._engine = null;
	this._attacker = null;
	this._defender = null;
	
	this._start("Random", "AI");
}

Game.App.prototype._start = function(attacker, defender) {
	this._engine = new Game.Engine();
	this._createDefender(defender);
	this._createAttacker(attacker);
}

Game.App.prototype._createDefender = function(defender) {
	if (this._defender) { this._defender.setEngine(null); }
	this._defender = this._createPlayer(defender, Game.Defender);
}

Game.App.prototype._createAttacker = function(attacker) {
	if (this._attacker) { this._attacker.setEngine(null); }
	this._attacker = this._createPlayer(attacker, Game.Attacker);
}

Game.App.prototype._createPlayer = function(type, namespace) {
	return new namespace[type](this._engine);
}
