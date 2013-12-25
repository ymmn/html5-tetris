function TetrisBoard(origin, w, stage) {

    // global variables
    var WIDTH = w;
    var BACKGROUND_COLOR = "#CDA";
    var GAME_BOUNDS = {
        lo: 0,
        hi: WIDTH * GRID_WIDTH
    };
    var boardContainer;
    var gameGridContainer;
    var opponent;
    var stage;
    var gameGrid;
    var paused = false;
    this.dead = false;
    var deadTerminos;
    var linesSentText;
    var gameOverText;
    var linesSent = 0;
    var that = this;
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

        /* Square */
        {
            color: "AFA",
            shape: [
                [
               		"XX--",
               		"XX--", "", ""],
           		[
               		"XX--",
               		"XX--", "", ""],
           		[
               		"XX--",
               		"XX--", "", ""],
           		[
               		"XX--",
               		"XX--", "", ""]
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


    function drawGameGrid() {
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
                gameGridContainer.addChild(s);
            }
        }

    }

    this.addConcreteLines = function (numlines) {
    	deadTerminos.addConcreteLines(numlines);
    };

    this.setOpponent = function(o) {
    	opponent = o;
    };

    this.die = function(){
        that.dead = true;
        gameOverText = new createjs.Text("GAME OVER!", "20px Arial", "#FFF");
        gameOverText.x = origin.x + 100;
        gameOverText.y = 100;
        stage.addChild(gameOverText);
    };

    this.attackOpponent = function(linesCleared){
        linesSent += linesCleared;
    	opponent.addConcreteLines(linesCleared);
        linesSentText.text = "Lines: " +  linesSent;
    };

    this.newTermino = function() {
        var ind = Math.floor(Math.random() * TERMINO_SHAPES.length);
        var t = TERMINO_SHAPES[ind];
        that.termino = new Termino(gameGridContainer, t.shape, t.color, WIDTH, deadTerminos, this);
        that.termino.addToStage();
    };

    this.tick = function(){
	    if (!that.dead && !paused && createjs.Ticker.getTicks() % 10 === 0) {
	        that.termino.fall();
	    }
    };

    var _init = function() {
        boardContainer = new createjs.Container();
        boardContainer.x += origin.x;
        boardContainer.y += origin.y;

        var background = new createjs.Shape();
        var g = background.graphics;

        g.beginStroke("#000");
        g.beginFill(BACKGROUND_COLOR);
        g.drawRect(0, 0, BOARD_DIMS.width, BOARD_DIMS.height);
        g.endFill();
        boardContainer.addChild(background);

        gameGridContainer = new createjs.Container();
        gameGridContainer.x += 30;
        gameGridContainer.y += 30;

        boardContainer.addChild(gameGridContainer);

	    drawGameGrid();

	    deadTerminos = new DeadTerminos(WIDTH, gameGridContainer, that);
	    that.newTermino();
        linesSentText = new createjs.Text("Lines: 0", "20px Arial", "#000");
        linesSentText.x = GRID_WIDTH * WIDTH + gameGridContainer.x + 5;
        linesSentText.y = 100;

        boardContainer.addChild(linesSentText);

        stage.addChild(boardContainer);
    };

    _init();

}
