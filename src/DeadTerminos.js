function DeadTerminos(w) {

	var WIDTH = w;
    var _grid = Array(GRID_WIDTH);
    for (var i = 0; i < GRID_WIDTH; i++) {
        _grid[i] = Array(GRID_HEIGHT);
    }

    this.isOccupied = function (x, y) {
        return _grid[x][y] !== undefined;
    };

    /**
     * Takes a 4x4 double array as termino shape
     */
    this.addTermino = function (shape, pos, color) {
        for (var y = 0; y < shape.length; y++) {
            for (var x = 0; x < shape[0].length; x++) {
                if (shape[x][y] !== undefined) {
                    _grid[pos.x() + x][pos.y() + y] = shape[x][y];
                }
            }
        }
        _checkCompeletedLines();
    };

    var _deleteLine = function (y) {
        for (var x = 0; x < GRID_WIDTH; x++) {
            stage.removeChild(_grid[x][y]);
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
                    s.y += WIDTH;
                }
            }
        }
    };

    var _checkCompeletedLines = function () {
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
            }
        }
    };

}