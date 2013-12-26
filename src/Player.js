function Player (board, controls) {
	
	var _bounce = {};
	var _rate = {
		right: 5,
		left: 5,
		up: 30,
		space: 30,
		pause: 30,
		down: 4,
		swap: 30
	};

	var _debounce = function(input, key) {
		/* not pressed at all */
		if( !input[key] ) {
			_bounce[key] = undefined;
			return false;
		}

		var curTicks = createjs.Ticker.getTicks();
		var lastUsed = _bounce[key];
		if( lastUsed === undefined || curTicks - lastUsed > _rate[key] ) {
			_bounce[key] = curTicks;
			return true;
		}
		return false;
	};

	this.tick = function(input){
		var ret = false;
		if( _debounce(input, "left") ) {
			board.termino.move(-1, 0);
		}
		if( _debounce(input, "right") ) {
			board.termino.move(1, 0);
		}
		if( _debounce(input, "down") ) {
			board.termino.fall();
		}
		if(_debounce(input, "up") ) {
			board.termino.rotateRight();
		}
		if(_debounce(input, "space") ) {
			board.termino.place();
		}
		if(_debounce(input, "pause") ) {
			board.paused = !paused;
		}
		if(_debounce(input, "swap") ) {
			board.swapWithSavedTermino();
		}
		return ret;
	};

}