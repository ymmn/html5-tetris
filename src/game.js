var GRID_HEIGHT = 20;
var GRID_WIDTH = 10;
var player1;
var player2;
var stage;

function handleKeyDown(e) {
    // for crossbrowser compatibility, as found in CreateJS example code
    if (!e) {
        var e = window.event;
    }

    var preventDef = player1.handleKeyDown(e);
    preventDef = player2.handleKeyDown(e) || preventDef;

    /* prevent arrow keys from scrolling window */
    if( preventDef ) {
        e.preventDefault();
    }

}

var tetrisBoard1;

function init() {

    // get a reference to the canvas we'll be working with:
    var canvas = document.getElementById("gameCanvas");

    // create a stage object to work with the canvas. This is the top level node in the display list:
    stage = new createjs.Stage(canvas);

    window.onkeydown = handleKeyDown;

    tetrisBoard2 = new TetrisBoard(
        { x: 400, y: 0 },
        canvas.height/20,
        stage
    );

    tetrisBoard1 = new TetrisBoard(
        { x: 0, y: 0 },
        canvas.height/20,
        stage
    );

    player1 = new Player(
        tetrisBoard1,
        {
            left: Keycode.LEFT,
            right: Keycode.RIGHT,
            up: Keycode.UP,
            down: Keycode.DOWN,
            pause: Keycode.P,
            hardDrop: Keycode.SPACE
        });
    player2 = new Player(
        tetrisBoard2,
        {});

    // call update on the stage to make it render the current display list to the canvas:
    stage.update();

    //start game timer   
    if (!createjs.Ticker.hasEventListener("tick")) {
        createjs.Ticker.addEventListener("tick", tick);
    }

}

function tick(event) {
    //tick event
    tetrisBoard1.tick();
    tetrisBoard2.tick();
    stage.update();
}

