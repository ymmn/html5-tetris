function Player (board, controls) {
	
	var _bounce = {};
	var _firstStep = {
		right: 7,
		left: 7
	};
	var _rate = {
		right: 3,
		left: 3,
		up: 30,
		space: 30,
		pause: 30,
		down: 4,
		swap: 30
	};

	var _debounceLeftRight = function(input, key) {
		/* not pressed at all */
		if( !input[key] ) {
			_bounce[key] = undefined;
			return false;
		}

		var curTicks = createjs.Ticker.getTicks();
		var firstPressed = _bounce[key];
		if( firstPressed === undefined ) {
			_bounce[key] = curTicks;
			return true;
		} else {
			var d = curTicks - firstPressed;
			/* is it first step? */
			if( d < _firstStep[key] ) {
				return false;
			} else {
				d -= _firstStep[key];
				return d % _rate[key] === 0;
			}
		}
	};

	var _debounce = function(input, key) {
		/* not pressed at all */
		if( !input[key] ) {
			_bounce[key] = undefined;
			return false;
		}

		var curTicks = createjs.Ticker.getTicks();
		var firstPressed = _bounce[key];

		if( firstPressed === undefined || (curTicks - firstPressed) % _rate[key] === 0 ) {
			_bounce[key] = curTicks;
			return true;
		}
		return false;
	}

	this.loadFromJson = function() {
		var test = {
			deadTerminos: [
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"----------",
				"1112223334"
			],
			termino: 1
		};
		deadTerminos.loadFromJson();

	};

	this.tick = function(input){
		var ret = false;
		if( _debounceLeftRight(input, "left") ) {
			board.termino.move(-1, 0);
		}
		if( _debounceLeftRight(input, "right") ) {
			board.termino.move(1, 0);
		}
		if( _debounce(input, "down") ) {
			board.termino.fall();
		}
		if(_debounce(input, "up") ) {
		    createjs.Sound.play("rotate", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.15);
			board.termino.rotateRight();
		}
		if(_debounce(input, "space") ) {
		    createjs.Sound.play("hardDrop", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.05);
			board.termino.place();
		}
		if(_debounce(input, "pause") ) {
			board.paused = !board.paused;
		}
		if(_debounce(input, "swap") ) {
			board.swapWithSavedTermino();
		}
		return ret;
	};

}