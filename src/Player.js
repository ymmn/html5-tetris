function Player (board, controls) {
	
	this.handleKeyDown = function(e) {
	    switch (e.keyCode) {
	    case controls.left:
	        board.termino.move(-1, 0);
	        break;
	    case controls.right:
	        board.termino.move(1, 0);
	        break;
	    case controls.up:
	        board.termino.rotateRight();
	        break;
	    case controls.down:
	        board.termino.fall();
	        break;
	    case controls.pause:
	        board.paused = !paused;
	        break;
	    case controls.hardDrop:
	        board.termino.place();
	        break;
	    default:
	    	return false;
	    }
	    return true;
	};

}