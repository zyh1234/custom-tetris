Game.App = function() {
	this._connected = null;
	this._firebase = null;
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
		description: document.querySelector("#description"),
		connect: document.querySelector("#connect"),
		server: document.querySelector("#server"),
		slug: document.querySelector("#slug")
	}
	this._select = {
		attacker: this._dom.attacker.querySelector("select"),
		defender: this._dom.defender.querySelector("select"),
		mode: this._dom.mode.querySelector("select")
	}

	this._dom.server.value = localStorage.getItem("tetris.server") || "ondras";
	this._select.mode.value = localStorage.getItem("tetris.mode") || "local";
	var slug = "";
	for (var i=0;i<3;i++) {
		var min = "a".charCodeAt(0);
		var max = "z".charCodeAt(0);
		var r = min + Math.floor(Math.random() * (max-min+1));
		slug += String.fromCharCode(r);
	}
	this._dom.slug.value = localStorage.getItem("tetris.slug") || slug;
	this._updateMode();

	this._updateDescription();

	this._select.attacker.addEventListener("change", this);
	this._select.defender.addEventListener("change", this);
	this._select.mode.addEventListener("change", this);

	this._createBackground();
	
	this._dom.connect.addEventListener("click", this);
	this._dom.play.addEventListener("click", this);
	this._dom.play.focus();
}

Game.App.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			if (e.target == this._select.mode) {
				localStorage.setItem("tetris.mode", this._select.mode.value);
				this._updateMode();
			} else {
				this._changePlayer(e);
			}
		break;
		
		case "click":
			switch (e.target) {
				case this._dom.connect:
					if (this._connected) { return; }
					this._connect();
				break;

				case this._dom.play:
					this._dom.setup.classList.add("playing");
					setTimeout(this._start.bind(this), 500);
				break;
			}
		break;
	}
}

Game.App.prototype._connect = function() {
	var server = this._dom.server.value;
	var slug = this._dom.slug.value;
	localStorage.setItem("tetris.server", server);
	localStorage.setItem("tetris.slug", slug);
	var url = "https://" + server + ".firebaseio.com/tetris/" + slug;
	this._firebase = new Firebase(url);
	this._firebase.once("value", function(snap) {
		this._connected = true;
		this._firebase.set(null);
		this._dom.connect.classList.add("connected");
		this._updateMode();
	}.bind(this));
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

Game.App.prototype._updateMode = function() {
	this._select.attacker.value = localStorage.getItem("tetris." + this._select.mode.value + ".attacker") || "Random";
	this._select.defender.value = localStorage.getItem("tetris." + this._select.mode.value + ".defender") || "AI";

	document.body.className = this._select.mode.value;
	this._dom.play.disabled = (this._select.mode.value == "network" && !this._connected);

	this._updateDescription();
}

Game.App.prototype._updateDescription = function() {
	var str = "";
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
	this._dom.description.innerHTML = str;
}

Game.App.prototype._start = function() {
	this._dom.left.appendChild(this._dom.defender);
	this._dom.right.appendChild(this._dom.attacker);
	
	if (this._select.mode.value == "local") {
		this._engine = new Game.Engine();
	} else {
		this._engine = new Game.Engine.Network(this._firebase);
	}
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

Game.App.prototype._createBackground = function() {
	var piece = new Game.Piece("t");
	piece.rotate(1);
	piece.rotate(1);
	piece.xy = new XY(1, 0);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("z");
	piece.rotate(-1);
	piece.xy = new XY(1, 2);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("j");
	piece.rotate(1);
	piece.rotate(1);
	piece.xy = new XY(4, 0);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("i");
	piece.rotate(1);
	piece.xy = new XY(2, 3);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("s");
	piece.rotate(1);
	piece.xy = new XY(5, 1);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("l");
	piece.rotate(1);
	piece.rotate(1);
	piece.xy = new XY(8, 0);
	piece.build(this._dom.setup);

	var piece = new Game.Piece("-");
	piece.rotate(1);
	piece.xy = new XY(1, 5);
	piece.build(this._dom.setup);
}

