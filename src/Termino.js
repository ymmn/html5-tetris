function Termino(type, board) {

    this.type = type;
    var _rotationIndex = 0;
    var _myShape = board.TERMINO_SHAPES[type].shape;
    var _easelShapes = new Array(4);
    for (var i = 0; i < _easelShapes.length; i++) {
        _easelShapes[i] = new Array(4);
    }
    var _shapeBounds = {};
    var _gridPos = $V([4, 0]);
    var _myColor = board.TERMINO_SHAPES[type].color;
    var _curShape = _myShape[_rotationIndex];
    var that = this;
    var _ghost = [];
    var _ghostOffset = 0;

    var _getGhostOffset = function () {
        var offset = 1;
        while (true) {
            var newy = _gridPos.y() + offset;
            var x = _gridPos.x();
            if (!_canMoveTo(x, newy, _curShape)) break;
            offset += 1;
        }
        _ghostOffset = offset - 1;
        return _ghostOffset;
    };

    var _createShape = function (x, y) {
        var s = new createjs.Shape();
        var g = s.graphics;

        g.beginStroke("#000");
        g.beginFill(_myColor);
        g.drawRect(x * board.BLOCK_SIZE, y * board.BLOCK_SIZE, board.BLOCK_SIZE, board.BLOCK_SIZE);
        g.endFill();
        board.gameGridContainer.addChild(s);
        return s;
    };

    var _redrawGhost = function () {
        _createGhost(_gridPos.x(), _gridPos.y() + _getGhostOffset());
    };

    var _removeGhost = function () {
        for (var i = 0; i < _ghost.length; i++) {
            board.gameGridContainer.removeChild(_ghost[i]);
        }
        _ghost = [];
    };

    var _createGhost = function (gx, gy) {
        _removeGhost();
        for (var y = 0; y < _curShape.length; y++) {
            for (var x = 0; x < _curShape[0].length; x++) {
                if (_curShape[y][x] === "X") {
                    var s = new createjs.Shape();
                    var g = s.graphics;

                    g.beginStroke("#FFF");
                    // g.beginFill(_myColor);
                    g.drawRect((gx + x) * board.BLOCK_SIZE, (gy + y) * board.BLOCK_SIZE, board.BLOCK_SIZE, board.BLOCK_SIZE);
                    // g.endFill();
                    board.gameGridContainer.addChild(s);
                    _ghost.push(s);
                }
            }
        }
    };

    this.addToStage = function () {
        _redraw();
    };

    var _getRequiredBoundsAdjustment = function(rotIndex) {
        /* check if too far left */
        var bounds = _getShapeBounds(_myShape[rotIndex]);
        if( (_gridPos.x() + bounds.loX) < 0 ) {
            return 1;
        }

        /* check if too far right */
        if( (_gridPos.x() + bounds.hiX) > GRID_WIDTH ) {
            return -1;
        }

        return 0;
    };

    var _attemptRotate = function(newRotIndex) {
        var adjust = _getRequiredBoundsAdjustment(newRotIndex);
        if(_canMoveTo(_gridPos.x() + adjust, _gridPos.y(), _myShape[newRotIndex])) {
            _curShape = _myShape[newRotIndex];
            _redraw();
            that.move(adjust, 0);
            return newRotIndex;
        }
        /* can't rotate! */
        return _rotationIndex;
    };

    this.rotateRight = function () {
        _rotationIndex = _attemptRotate( (_rotationIndex + 1) % 4 );
    };

    this.rotateLeft = function () {
        _rotationIndex = _attemptRotate( _rotationIndex == 0 ? 4 : (_rotationIndex - 1) );
    };

    var _canMoveTo = function (newx, newy, shape) {
        var bounds = _getShapeBounds(shape);
        // console.log("lo " + bounds.loX + " hi " + bounds.hiX);
        if ( /* x bounds */ (newx + bounds.loX) < 0 || (newx + bounds.hiX) > GRID_WIDTH ||
             /* y bounds  */
            (newy + bounds.loY) < 0 || (newy + bounds.hiY) > GRID_HEIGHT) {
            return false;
        }

        /* check if the we're overlapping with a termino */
        for (var y = 0; y < shape.length; y++) {
            for (var x = 0; x < shape[0].length; x++) {
                if (shape[y][x] === 'X') {
                    // console.log("x " + x + " y " + y);
                    if (board.deadTerminos.isOccupied(newx + x, newy + y)) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    /**
     * Tries to move a termino to the right/left and up/down by the amount specified
     * by the parameters.
     * Returns true if successfully moved. Otherwise, returns false
     */
    this.move = function (x, y) {
        var newx = _gridPos.x() + x;
        var newy = _gridPos.y() + y;

        if (!_canMoveTo(newx, newy, _curShape)) return false;

        _gridPos = $V([newx, newy]);

        /* draw ghost */
        if (x !== 0) {
            _redrawGhost();
        }
        _updatePos();
        return true;
    };

    this.place = function () {
        while (this.fall()) {
            // keep falling into place
        }
    };

    this.fall = function () {
        if (this.move(0, 1)) {
            // goodie!
            return true;
        } else {
            _removeGhost();
            board.deadTerminos.addTermino(_easelShapes, _gridPos, _myColor);
            board.newTermino(true);
            return false;
        }
    };

    this.remove = function(){
        for (var i = 0; i < _easelShapes.length; i++) {
            for (var j = 0; j < _easelShapes[0].length; j++) {
                var s = _easelShapes[i][j];
                if (s !== undefined) {
                    board.gameGridContainer.removeChild(s);
                    board.swapContainer.removeChild(s);
                }
            }
        }
        _removeGhost();
    };

    this.drawAsSwap = function(){
        this.remove();
        for (var i = 0; i < _easelShapes.length; i++) {
            for (var j = 0; j < _easelShapes[0].length; j++) {
                var s = _easelShapes[i][j];
                if (s !== undefined) {
                    // WHY?
                    s.x = i * board.BLOCK_SIZE / 20;
                    s.y = j * board.BLOCK_SIZE / 20;
                    board.swapContainer.addChild(s);
                }
            }
        }
    };

    var _updatePos = function () {
        for (var i = 0; i < _easelShapes.length; i++) {
            for (var j = 0; j < _easelShapes[0].length; j++) {
                var s = _easelShapes[i][j];
                if (s !== undefined) {
                    s.x = board.BLOCK_SIZE * _gridPos.x();
                    s.y = board.BLOCK_SIZE * _gridPos.y();
                }
            }
        }
    };

    var _getShapeBounds = function(shape) {
        if(_shapeBounds[shape] === undefined) {
            var loX = 100;
            var loY = 100;
            var hiY = 0;
            var hiX = 0;
            for (var x = 0; x < shape[0].length; x++) {
                for (var y = 0; y < shape.length; y++) {
                    if (shape[y][x] === "X") {
                        loX = Math.min(loX, x);
                        loY = Math.min(loY, y);
                        hiX = x + 1;
                        hiY = Math.max(hiY, y + 1);
                    }
                }
            }
            _shapeBounds[shape] = {
                loX: loX,
                loY: loY,
                hiX: hiX,
                hiY: hiY
            };
        }
        return _shapeBounds[shape];
    };

    var _redraw = function () {
        for (var x = 0; x < _easelShapes.length; x++) {
            for (var y = 0; y < _easelShapes[0].length; y++) {
                if (_curShape[y][x] != "X") {
                    // delete shape
                    board.gameGridContainer.removeChild(_easelShapes[x][y]);
                    _easelShapes[x][y] = undefined;
                } else {
                    if (_easelShapes[x][y] === undefined) {
                        // create shape
                        var s = _createShape(x, y);
                        _easelShapes[x][y] = s;
                    }
                }
            }
        }
        that.move(_getRequiredBoundsAdjustment(_rotationIndex), 0);
        _redrawGhost();
        _updatePos();
    };

}