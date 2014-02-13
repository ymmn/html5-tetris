var GRID_HEIGHT = 20;
var GRID_WIDTH = 10;
var player1;
var player2;
var stage;
var input = {};
var mute = false;
var tetris_state;
var BOARD_DIMS;
var fb = new Firebase("https://ymn.firebaseio.com/tetris/hiscores");

function keyHandler(e, isPressed){
    switch (e.keyCode) {
    case Keycode.LEFT:
        input.left = isPressed;
        break;
    case Keycode.RIGHT:
        input.right = isPressed;
        break;
    case Keycode.UP:
        input.up = isPressed;
        break;
    case Keycode.DOWN:
        input.down = isPressed;
        break;
    case Keycode.P:
        input.pause = isPressed;
        break;
    case Keycode.SPACE:
        input.space = isPressed;
        break;
    case Keycode.C:
        input.swap = isPressed;
        break;
    default:
        return false;
    }
    return true;
}

function handleKeyUp(e) {
    keyHandler(e, false);
}

function handleKeyDown(e) {

    /* prevent arrow keys from scrolling window */
    if( keyHandler(e, true) ) {
        e.preventDefault();
    }

}

var tetrisBoard1;


function doneLoading(event) {
    // start the music
    createjs.Sound.play("background", createjs.Sound.INTERRUPT_NONE, 0, 0, -1, 0.05);
}

function addToHighscores(new_score) {
    for(var i = 0; i < 5; i++) {
        var cur_score = 0;
        if( hiscores[i] !== undefined ) {
            cur_score = hiscores[i].score;
        }
        if(new_score > cur_score) {
            var name = prompt("What's your name, champ?");

            /* shift all scores below this score down */
            for(var j = 4; j > i; j--) {
                hiscores[j] = hiscores[j-1];
            }

            hiscores[i] = {
                name: name,
                score: new_score
            };
            console.log(hiscores);
            fb.update(hiscores);
            break;
        }
    }
}

function toggleSound(){
    mute = !mute;
    createjs.Sound.setMute(mute);
    if(mute) {
        $("#mute").html("Unmute Sound");
    } else {
        $("#mute").html("Mute Sound");
    }
}

function init() {

    // get a reference to the canvas we'll be working with:
    var canvas = document.getElementById("gameCanvas");

    // create a stage object to work with the canvas. This is the top level node in the display list:
    stage = new createjs.Stage(canvas);

    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;


    var w = canvas.height/22;
    BOARD_DIMS = {
        width: w * GRID_WIDTH + 150,
        height: w * GRID_HEIGHT + 60
    };

    tetrisBoard2 = new TetrisBoard(
        { x: BOARD_DIMS.width + 50, y: 0 },
        w,
        stage
    );

    tetrisBoard1 = new TetrisBoard(
        { x: 0, y: 0 },
        w,
        stage
    );

    tetrisBoard1.setOpponent(tetrisBoard2);
    tetrisBoard2.setOpponent(tetrisBoard1);

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

    createjs.Ticker.setFPS(60);

    // begin loading content (only sounds to load)
    var manifest = [{
        id: "background",
        src: "assets/background.mp3"
    }, {
        id: "hardDrop",
        src: "assets/SFX_PieceHardDrop.ogg"
    }, {
        id: "lineClear",
        src: "assets/SFX_SpecialLineClearSingle.ogg"
    },
    {
        id: "fall",
        src: "assets/SFX_PieceFall.ogg"
    },
    {
        id: "rotate",
        src: "assets/SFX_PieceRotateLR.ogg"
    }];

    preload = new createjs.LoadQueue();
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", doneLoading); // add an event listener for when load is completed
    preload.loadManifest(manifest);

    fb.on('value', function(snapshot) {
        $("#hiscores tbody").empty();
        var message = snapshot.val();
        hiscores = message;
        for(var i = 0; i < 5; i++){
            var hs = hiscores[i];
            if( hs !== undefined ) {
                $("#hiscores tbody").append("<tr><td>" + hs.name + "</td><td>" + hs.score + "</td></tr>");
            } else {
                $("#hiscores tbody").append("<tr><td>N/A</td><td>N/A</td></tr>");
            }
        }
    });

    $("#mute").click(toggleSound);

}

function tick(event) {
    player1.tick(input);
    tetrisBoard1.tick();
    tetrisBoard2.tick();
    stage.update();
}

