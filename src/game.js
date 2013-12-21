// global variables
var GRID_HEIGHT = 20;
var GRID_WIDTH = 10;
var GAME_BOUNDS;
var WIDTH;
var stage;
var gameGrid;
var deadTerminos;
var TERMINO_SHAPES = [
    /* straight */
    {
        color: "0F0",
        shape: [
            ["XXXX", "", "", ""],
            ["-X--",
                "-X--",
                "-X--",
                "-X--"
            ],
            ["XXXX", "", "", ""],
            ["-X--",
                "-X--",
                "-X--",
                "-X--"
            ]
        ]
    },

    /* L-shape */
    {
        color: "FF0",
        shape: [
            [
                "XXX-",
                "--X-", "", ""
            ],
            [
                "-X--",
                "-X--",
                "XX--", ""
            ],
            [
                "X---",
                "XXX-", "", ""
            ],
            [
                "-XX-",
                "-X--",
                "-X--", ""
            ]
        ]
    },

    /* L-shape #2 */
    {
        color: "F0F",
        shape: [
            [
                "XXX-",
                "X---", "", ""
            ],
            [
                "XX--",
                "-X--",
                "-X--", ""
            ],
            [
                "--X-",
                "XXX-", "", ""
            ],
            [
                "-X--",
                "-X--",
                "-XX-", ""
            ]
        ]
    },

    /* Z-shape */
    {
        color: "00F",
        shape: [
            [
                "XX--",
                "-XX-", "", ""
            ],
            [
                "--X-",
                "-XX-",
                "-X--", ""
            ],
            [
                "XX--",
                "-XX-", "", ""
            ],
            [
                "--X-",
                "-XX-",
                "-X--", ""
            ]
        ]
    },

    /* Z-shape #2 */
    {
        color: "0FF",
        shape: [
            [
                "-XX-",
                "XX--", "", ""
            ],
            [
                "-X--",
                "-XX-",
                "--X-", ""
            ],
            [
                "-XX-",
                "XX--", "", ""
            ],
            [
                "-X--",
                "-XX-",
                "--X-", ""
            ]
        ]
    },
    /* t-shape */
    {
        color: "F00",
        shape: [
            ["XXX",
                "-X-", "", ""
            ],
            ["-X",
                "XX",
                "-X", ""
            ],
            ["-X-",
                "XXX", "", ""
            ],
            ["X-",
                "XX",
                "X-", ""
            ]
        ]
    }
];

function drawGameGrid(stage) {
    for (var x = 0; x < GRID_WIDTH; x++) {
        for (var y = 0; y < GRID_HEIGHT; y++) {
            var s = new createjs.Shape();
            var g = s.graphics;

            g.beginStroke("#000");

            var color = "#000";
            if ((x + y) % 2 === 0) {
                color = "#222";
            }
            g.beginFill(color);
            g.drawRect(x * WIDTH, y * WIDTH, WIDTH, WIDTH);
            g.endFill();
            stage.addChild(s);
        }
    }

}

function DeadTerminos() {

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

function Termino(grid, col) {

    var _rotationIndex = 0;
    var _myShape = grid;
    var _easelShapes = new Array(4);
    for (var i = 0; i < _easelShapes.length; i++) {
        _easelShapes[i] = new Array(4);
    }
    var _loX = 0;
    var _loY = 0;
    var _myWidth = 0;
    var _myHeight = 0;
    var _gridPos = $V([0, 0]);
    var _myColor = col;
    var _curShape = _myShape[_rotationIndex];
    var that = this;
    var _ghost = [];
    var _ghostOffset = 0;

    var _getGhostOffset = function () {
        var offset = 1;
        while (true) {
            var newy = _gridPos.y() + offset;
            var x = _gridPos.x();
            if (!_canMoveTo(x, newy)) break;
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
        g.drawRect(x * WIDTH, y * WIDTH, WIDTH, WIDTH);
        g.endFill();
        stage.addChild(s);
        return s;
    };

    var _redrawGhost = function () {
        _createGhost(_gridPos.x(), _gridPos.y() + _getGhostOffset());
    };

    var _removeGhost = function () {
        for (var i = 0; i < _ghost.length; i++) {
            stage.removeChild(_ghost[i]);
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
                    g.drawRect((gx + x) * WIDTH, (gy + y) * WIDTH, WIDTH, WIDTH);
                    // g.endFill();
                    stage.addChild(s);
                    _ghost.push(s);
                }
            }
        }
    };

    this.addToStage = function (stage) {
        _redraw();
    };

    var _adjustToBounds = function() {
        /* check if too far left */
        if( (_gridPos.x() + _loX) < 0 ) {
            that.move(1, 0);
        }

        /* check if too far right */
        if( (_gridPos.x() + _myWidth) > GRID_WIDTH ) {
            that.move(-1, 0);
        }
    };

    this.rotateRight = function () {
        _rotationIndex = (_rotationIndex + 1) % 4;
        _curShape = _myShape[_rotationIndex];
        _redraw();
        _adjustToBounds();
    };

    this.rotateLeft = function () {
        var r = _rotationIndex - 1;
        if (r < 0) r += 4;
        _rotationIndex = r;
        _curShape = _myShape[_rotationIndex];
        _redraw();
    };

    var _canMoveTo = function (newx, newy) {
        if ( /* x bounds */ (newx + _loX) < 0 || (newx + _myWidth) > GRID_WIDTH ||
            /* y bounds */
            (newy + _loY) < 0 || (newy + _myHeight) > GRID_HEIGHT) {
            return false;
        }

        /* check if the we're overlapping with a termino */
        for (var x = 0; x < _easelShapes.length; x++) {
            for (var y = 0; y < _easelShapes[0].length; y++) {
                if (_easelShapes[x][y] !== undefined) {
                    if (deadTerminos.isOccupied(newx + x, newy + y)) {
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

        if (!_canMoveTo(newx, newy)) return false;

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
            deadTerminos.addTermino(_easelShapes, _gridPos, _myColor);
            newTermino();
            return false;
        }
    };


    var _updatePos = function () {
        for (var i = 0; i < _easelShapes.length; i++) {
            for (var j = 0; j < _easelShapes[0].length; j++) {
                var s = _easelShapes[i][j];
                if (s !== undefined) {
                    s.x = WIDTH * _gridPos.x();
                    s.y = WIDTH * _gridPos.y();
                }
            }
        }
    };

    var _redraw = function () {
        _loX = 100;
        _loY = 100;
        _myHeight = 0;
        _myWidth = 0;
        for (var x = 0; x < _easelShapes.length; x++) {
            for (var y = 0; y < _easelShapes[0].length; y++) {
                if (_curShape[y][x] != "X") {
                    // delete shape
                    stage.removeChild(_easelShapes[x][y]);
                    _easelShapes[x][y] = undefined;
                } else {
                    _loX = Math.min(_loX, x);
                    _loY = Math.min(_loY, y);
                    _myWidth = x + 1;
                    _myHeight = Math.max(_myHeight, y + 1);
                    if (_easelShapes[x][y] === undefined) {
                        // create shape
                        var s = _createShape(x, y);
                        _easelShapes[x][y] = s;
                    }
                }
            }
        }
        // this.move(0, 0);
        _adjustToBounds();
        _redrawGhost();
        _updatePos();
    };

}

function newTermino() {
    var ind = Math.floor(Math.random() * TERMINO_SHAPES.length);
    var t = TERMINO_SHAPES[ind];
    window.termino = new Termino(t.shape, t.color);
    termino.addToStage(stage);
}

function init() {
    // get a reference to the canvas we'll be working with:
    var canvas = document.getElementById("gameCanvas");

    WIDTH = canvas.height / GRID_HEIGHT;
    GAME_BOUNDS = {
        lo: 0,
        hi: WIDTH * GRID_WIDTH
    };

    // create a stage object to work with the canvas. This is the top level node in the display list:
    stage = new createjs.Stage(canvas);

    window.onkeydown = handleKeyDown;

    drawGameGrid(stage);

    deadTerminos = new DeadTerminos();
    newTermino();

    // call update on the stage to make it render the current display list to the canvas:
    stage.update();

    //start game timer   
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }

}

function handleKeyDown(e) {
    // for crossbrowser compatibility, as found in CreateJS example code
    if (!e) {
        var e = window.event;
    }

    switch (e.keyCode) {
    case Keycode.LEFT:
    case Keycode.A:
        termino.move(-1, 0);
        break;
    case Keycode.RIGHT:
    case Keycode.D:
        termino.move(1, 0);
        break;
    case Keycode.UP:
    case Keycode.W:
        termino.rotateRight();
        break;
    case Keycode.DOWN:
    case Keycode.S:
        termino.fall();
        break;
    case Keycode.SPACE:
        termino.place();
        break;
    }
}

function tick(event) {
    //tick event
    if (createjs.Ticker.getTicks() % 10 === 0) {
        termino.fall();
    }
    stage.update();
}