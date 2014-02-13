function DeadTerminos(board) {

    var _grid = Array(GRID_WIDTH);
    var _concreteLines = [];
    for (var i = 0; i < GRID_WIDTH; i++) {
        _grid[i] = Array(GRID_HEIGHT);
    }

    this.isOccupied = function (x, y) {
    	if( y >= (GRID_HEIGHT - _concreteLines.length) ) return true;
        return _grid[x][y + _concreteLines.length] !== undefined;
    };

    var _removeConcreteLines = function(numLines) {
    	var l = _concreteLines.length;

        /* make sure not to remove more than the number of concrete lines */
        var linesToRemove = Math.min(l, numLines);
     	for(var i = 0; i < _grid.length; i++){
    		for(var j = 0; j < _grid[0].length; j++) {
    			if(_grid[i][j] !== undefined) {
    				_grid[i][j].y += linesToRemove * board.BLOCK_SIZE;
    			}
    		}
    	}   	
     	for(var i = 0; i < linesToRemove; i++) {
    		var line = _concreteLines[l -  1 - i];
    		for(var j = 0; j < GRID_WIDTH; j++) {
                board.gameGridContainer.removeChild(line[j]);
    		}
    	}   	
    	_concreteLines = _concreteLines.slice(0, l - linesToRemove);
    };

    this.addConcreteLines = function(numLines) {
    	for(var i = 0; i < _grid.length; i++){
    		for(var j = 0; j < _grid[0].length; j++) {
    			if(_grid[i][j] !== undefined) {
    				_grid[i][j].y -= numLines * board.BLOCK_SIZE;
    			}
    		}
    	}
    	for(var i = 0; i < numLines; i++) {
    		var line = [];
    		for(var j = 0; j < GRID_WIDTH; j++) {
                var s = new createjs.Shape();
                var g = s.graphics;

                g.beginStroke("#000");

                var color = "#888";
                g.beginFill(color);
                g.drawRect(j * board.BLOCK_SIZE, (GRID_HEIGHT - 1 - _concreteLines.length) * board.BLOCK_SIZE, board.BLOCK_SIZE, board.BLOCK_SIZE);
                g.endFill();
                board.gameGridContainer.addChild(s);
                line.push(s);
    		}
    		_concreteLines.push(line);
    	}
    };

    /**
     * Takes a 4x4 double array as termino shape
     */
    this.addTermino = function (shape, pos, color) {
        for (var y = 0; y < shape.length; y++) {
            for (var x = 0; x < shape[0].length; x++) {
                if (shape[x][y] !== undefined) {
                    _grid[pos.x() + x][pos.y() + y + _concreteLines.length] = shape[x][y];
                    if( (pos.y() + y) == 0) {
                    	board.die();
                    }
                }
            }
        }
        _checkCompeletedLines();
    };

    var _deleteLine = function (y) {
        for (var x = 0; x < GRID_WIDTH; x++) {
            board.gameGridContainer.removeChild(_grid[x][y]);
            _grid[x][y] = undefined;
        }
    };

    /**
     * push every line above line deletedLine down
     */
    var _pushLinesDown = function (deletedLine) {
        for (var x = 0; x < GRID_WIDTH; x++) {
            for (var y = deletedLine; y > 0; y--) {
                if (_grid[x][y - 1] !== undefined) {
                    var s = _grid[x][y - 1];
                    _grid[x][y] = s;
                    _grid[x][y - 1] = undefined;
                    s.y += board.BLOCK_SIZE;
                }
            }
        }
    };

    var _checkCompeletedLines = function () {
    	var cleared = 0;
        for (var y = 0; y < GRID_HEIGHT; y++) {
            var completed = true;
            for (var x = 0; x < GRID_WIDTH; x++) {
                if (_grid[x][y] === undefined) {
                    completed = false;
                    break;
                }
            }
            if (completed) {
                _deleteLine(y);
                _pushLinesDown(y);
                cleared++;
            }
        }
        board.attackOpponent(cleared);
        _removeConcreteLines(cleared);
        if(cleared > 0) {
            createjs.Sound.play("lineClear", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.2);
        }
    };

    this.addConcreteLines(5);

}