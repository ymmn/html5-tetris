function TetrisBoard(origin, w, stage) {

    // global variables
    var that = this;
    var BACKGROUND_COLOR = "#CDA";
    var GAME_BOUNDS = {
        lo: 0,
        hi: that.BLOCK_SIZE * GRID_WIDTH
    };
    var boardContainer;
    var nextTermino;
    var savedTermino = undefined;
    var opponent;
    var stage;
    var gameGrid;
    var paused = false;
    var linesSentText;
    var gameOverText;
    var linesSent = 0;
    var canSwap = true;
    that.TERMINO_SHAPES = [

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

    that.gameGridContainer = null;
    that.deadTerminos = null;
    that.dead = false;
    that.BLOCK_SIZE = w;

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
                g.drawRect(x * that.BLOCK_SIZE, y * that.BLOCK_SIZE, that.BLOCK_SIZE, that.BLOCK_SIZE);
                g.endFill();
                that.gameGridContainer.addChild(s);
            }
        }

    }

    this.addConcreteLines = function (numlines) {
    	that.deadTerminos.addConcreteLines(numlines);
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

    this.swapWithSavedTermino = function() {
        if(canSwap){
            var prev = savedTermino;
            var type = undefined;
            if( prev !== undefined ) {
                prev.remove();
                type = prev.type;
            }
            savedTermino = that.termino;
            that.termino.drawInContainer(that.swapContainer);
            that.newTermino(false, type);
        }
    };

    this.newTermino = function(placed, ind) {
        canSwap = placed;
        if( ind === undefined ) {
            ind = Math.floor(Math.random() * that.TERMINO_SHAPES.length);
            if( nextTermino !== undefined ) {
                that.termino = nextTermino;
                that.termino.addToStage();
                that.termino.move(0, 0);
            } else {
                that.termino = new Termino(ind, this);
            }
            nextTermino = new Termino(Math.floor(Math.random() * that.TERMINO_SHAPES.length), this);
            nextTermino.drawInContainer(that.nextQueueContainer);
        } else {
            that.termino = new Termino(ind, this);
        }
    };

    this.tick = function(){
	    if (!that.dead && !paused && createjs.Ticker.getTicks() % 40 === 0) {
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

        that.gameGridContainer = new createjs.Container();
        that.gameGridContainer.x += 30;
        that.gameGridContainer.y += 30;

        that.swapContainer = new createjs.Container();
        that.swapContainer.x = GRID_WIDTH * that.BLOCK_SIZE + that.gameGridContainer.x + 5;
        that.swapContainer.y = 0; 

        that.nextQueueContainer = new createjs.Container();
        that.nextQueueContainer.x = GRID_WIDTH * that.BLOCK_SIZE + that.gameGridContainer.x + 5;
        that.nextQueueContainer.y = 200; 

        boardContainer.addChild(that.gameGridContainer);
        boardContainer.addChild(that.swapContainer);
        boardContainer.addChild(that.nextQueueContainer);

	    drawGameGrid();

	    that.deadTerminos = new DeadTerminos(that);
	    that.newTermino(true);
        linesSentText = new createjs.Text("Lines: 0", "20px Arial", "#000");
        linesSentText.x = GRID_WIDTH * that.BLOCK_SIZE + that.gameGridContainer.x + 5;
        linesSentText.y = 100;

        boardContainer.addChild(linesSentText);

        stage.addChild(boardContainer);
    };

    _init();

}
