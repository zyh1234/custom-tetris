Game.App = function() {
	this._engine = null;
	this._attacker = null;
	this._defender = null;
	this._dom = {
		left: document.querySelector("#left"),
		right: document.querySelector("#right"),
		attacker: document.querySelector("#attacker"),
		defender: document.querySelector("#defender"),
		play: document.querySelector("#play"),
		setup: document.querySelector("#setup"),
		mode: document.querySelector("#mode"),
		description: document.querySelector("#description")
	}
	this._select = {
		attacker: this._dom.attacker.querySelector("select"),
		defender: this._dom.defender.querySelector("select"),
		mode: this._dom.mode.querySelector("select")
	}

	this._select.mode.value = localStorage.getItem("tetris.mode") || "local";
	this._select.attacker.value = localStorage.getItem("tetris." + this._select.mode.value + ".attacker") || "Random";
	this._select.defender.value = localStorage.getItem("tetris." + this._select.mode.value + ".defender") || "AI";
	this._updateDescription();

	this._select.attacker.addEventListener("change", this);
	this._select.defender.addEventListener("change", this);
	this._select.mode.addEventListener("change", this);
	
	this._dom.play.addEventListener("click", this);
	this._dom.play.focus();
}

Game.App.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			if (e.target == this._select.mode) {
				this._changeMode(e);
			} else {
				this._changePlayer(e);
			}
		break;
		
		case "click":
			this._start();
		break;
	}
}

Game.App.prototype._changePlayer = function(e) {
	localStorage.setItem("tetris." + this._select.mode.value + ".attacker", this._select.attacker.value);
	localStorage.setItem("tetris." + this._select.mode.value + ".defender", this._select.defender.value);

	if (this._engine) {
		if (e.target == this._select.attacker) { this._createAttacker(e.target.value); }
		if (e.target == this._select.defender) { this._createDefender(e.target.value); }
	} else {
		this._updateDescription();
	}
}

Game.App.prototype._changeMode = function(e) {
	this._updateDescription();
}

Game.App.prototype._updateDescription = function() {
	var str = "";
	if (this._select.mode.value == "local") {
		var key = this._select.attacker.value + "-" + this._select.defender.value;
		switch (key) {
			case "Random-Human":
				str = "The Classic Tetris";
			break;

			case "Random-AI":
				str = "Sit and watch";
			break;

			case "AI-Human":
				str = "Bastet (Bastard Tetris)";
			break;

			case "AI-AI":
				str = "Clash of the Titans";
			break;

			case "Human-Human":
				str = "Local multiplayer";
			break;

			case "Human-AI":
				str = "Revenge!";
			break;
		}
		if (str) { str = "This configuration is known as <strong>" + str + "</strong>"; }
	}
	this._dom.description.innerHTML = str;
}

Game.App.prototype._start = function() {
	this._dom.setup.classList.add("playing");
	if (this._engine) { this._engine.destroy(); }
	
	this._dom.left.appendChild(this._dom.defender);
	this._dom.right.appendChild(this._dom.attacker);
	
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
