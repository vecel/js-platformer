/* eslint-disable */
class Game {
    constructor() {

        this.level = {
            backgroundColor: '#777',

            world: new Game.World(),
            player: new Game.Player(),

            height: 80,
            width: 128,

            collideObject: function (object) {

                if (object.x < 0) { 
                    object.x = 0;
                    
                    /**
                     * objects's velocityX is rounded so that tile map is moving smoothly,
                     * otherwise tiles move by nondecimal values and then graphics isn't
                     * rendered in solid color, but it has stripes in different color
                     */
                    this.world.moveHorizontally(Math.round(-object.velocityX));
                    object.velocityX = 0;
                }
                if (object.x + object.width > this.width) { 
                    object.x = this.width - object.width;
                    this.world.moveHorizontally(Math.round(-object.velocityX));
                    object.velocityX = 0;
                }
                if (object.y < 0) { 
                    object.y = 0;
                    this.world.moveVertically(object.velocityY);
                    object.velocityY = 0;
                }
                if (object.y + object.height > this.height) { 
                    object.y = this.height - object.height;
                    // this.world.moveVertically(-object.velocityY);
                    object.jumpCounter = 0; 
                    object.velocityY = 0;
                }
                
            },

            init: function () {

                this.world.init();

            },

            update: function () {

                this.player.velocityY += this.world.gravity;
                this.player.velocityX *= this.world.friction;
                this.player.update();

                this.collideObject(this.player);

            }
        }

    }

    init() {

        this.level.init();

    }

    update() {

        this.level.update();

    }
}

Game.Rectangle = class {
    constructor(x, y, width, height) {

        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.oldX   = x;
        this.oldY   = y;

    } 
}

Game.Player = class extends Game.Rectangle {
    constructor() {
        super(50, 100, 16, 16); // initial player values

        this.color       = '#f00';
        this.VELOCITY    = 3;

        this.jumpCounter = 0;
        this.velocityX   = 0;
        this.velocityY   = 0;

    }

    jump() {

        if (this.jumpCounter == 2) return;

        this.velocityY = -15;
        this.jumpCounter++;

    }

    moveLeft() {

        this.velocityX = -this.VELOCITY;

    }

    moveRight() {

        this.velocityX = this.VELOCITY;

    }

    update() {

        this.x += this.velocityX;
        this.y += this.velocityY;

    }
}

Game.World = class {
    constructor(levelId) {

        this.mapSketch = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X',
                    'X', '.', '.', '.', 'X', '.', '.', 'X',
                    '.', '.', '.', 'X', '.', '.', '.', 'X',
                    'X', '.', '.', '.', 'X', 'X', '.', 'X',
                    'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];
        
        this.columns    = 8;
        this.tileWidth  = 16;
        this.tileHeight = 16;

        this.map = [];

        this.gravity = 3;
        this.friction = 0.7;

        this.offsetX = 0;
        this.offsetY = 0;

    }

    init() {

        this.initMap(this.columns, this.tileWidth, this.tileHeight);

    }

    initMap(columns, tileWidth, tileHeight) {

        for (let i = 0; i <= this.mapSketch.length; ++i) {
            if (this.mapSketch[i] === 'X')
                this.map.push(new Game.Tile((i % columns) * tileWidth, Math.floor(i / columns) * tileHeight, tileWidth, tileHeight, this.mapSketch[i]));
        }
        console.log(this.map);

    }

    moveHorizontally(offset) {

        this.offsetX += offset;
        console.log(this.offsetX);

    }

    moveVertically(offset) {

        this.offsetY += offset;

    }
    
}

Game.Tile = class extends Game.Rectangle {
    constructor(x, y, width, height, id) {
        super(x, y, width, height);
    
        this.id = id;

    }
}

export default Game;
