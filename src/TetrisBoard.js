function TetrisBoard(origin, w, stage) {

    // global variables
    var WIDTH = w;
    var GAME_BOUNDS = {
        lo: 0,
        hi: WIDTH * GRID_WIDTH
    };
    var stage;
    var gameGrid;
    var paused = false;
    var deadTerminos;
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
                g.drawRect(origin.x + x * WIDTH, origin.y + y * WIDTH, WIDTH, WIDTH);
                g.endFill();
                stage.addChild(s);
            }
        }

    }


    this.newTermino = function() {
        var ind = Math.floor(Math.random() * TERMINO_SHAPES.length);
        var t = TERMINO_SHAPES[ind];
        that.termino = new Termino(origin, t.shape, t.color, WIDTH, deadTerminos, this);
        that.termino.addToStage(stage);
    }

    this.tick = function(){
	    if (!paused && createjs.Ticker.getTicks() % 10 === 0) {
	        that.termino.fall();
	    }
    };

    var _init = function() {
	    drawGameGrid(stage);
	    deadTerminos = new DeadTerminos(WIDTH);
	    that.newTermino();
    };

    _init();

}
