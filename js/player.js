Game.Player = function(engine) {
	this._engine = engine;
}

Game.Player.prototype.destroy = function() {
}

Game.Attacker.Remote = Game.Defender.Remote = Game.Player;
