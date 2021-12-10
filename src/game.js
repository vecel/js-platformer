/* eslint-disable */
// import Game.Collider from 'collider.js';

class Game {
    constructor() {

        this.level = {

            backgroundColor: '#777',
            height: 80,
            width: 128,

            world: new Game.World(),
            // player: new Game.Player(),

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

                // this.collideObject(this.player);
                // this.collider.collideWithBoundries(this.player);
                // this.world.moveHorizontally(this.collider.getOffsetX);
                // this.world.moveVertically(this.collider.getOffsetY);
                this.world.update();

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

    setLeft(x)   { this.x = x; }
    setRight(x)  { this.x = x - this.width; }
    setTop(y)    { this.y = y; }
    setBottom(y) { this.y = y - this.height; }

    getLeft()   { return this.x; }
    getRight()  { return this.x + this.width; }
    getTop()    { return this.y; }
    getBottom() { return this.y + this.height; }
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

        this.collisionMap = [1, 1, 1, 1, 1, 1, 1, 1,
                            1, 1, 1, 1, 1, 1, 1, 1,
                            1, 1, 0, 0, 0, 0, 0, 0,
                            1, 0, 0, 0, 0, 0, 0, 0,
                            1, 1, 1, 1, 1, 1, 1, 1];

        this.collider = new Game.World.Collider();
        
        this.columns    = 8;
        this.rows       = 5;
        this.tileWidth  = 16;
        this.tileHeight = 16;

        this.map = [];

        this.player = new Game.Player();

        this.gravity = 3;
        this.friction = 0.7;

        this.offsetX = 0;
        this.offsetY = 0;

        this.width  = this.columns * this.tileWidth;
        this.height = this.rows * this.tileHeight;

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

    collideObject(object) {

        if (object.getLeft() < 8) { 

            object.setLeft(8);
            
            /**
             * object's velocityX is rounded so that tile map is moving smoothly,
             * otherwise tiles move by nondecimal values and then graphics isn't
             * rendered in solid color, but it has stripes in different color
             */
            this.offsetX += Math.round(-object.velocityX);
            object.velocityX = 0;

        }
        if (object.getRight() > this.width - 8) { 

            object.setRight(this.width - 8);
            this.offsetX += Math.round(-object.velocityX);
            object.velocityX = 0;

        }
        if (object.getTop() < 8) { 
            object.setTop(8);
            this.offsetY += Math.round(-object.velocityY);
            object.velocityY = 0;
        }
        if (object.getBottom() > this.height - 8) { 
            object.setBottom(this.height - 8);
            object.jumpCounter = 0; 
            object.velocityY = 0;
        }

    }

    update() {

        this.player.velocityY += this.gravity;
        this.player.velocityX *= this.friction;
        this.player.update();

        this.collideObject(this.player);        

    }
    
}

Game.Tile = class extends Game.Rectangle {
    constructor(x, y, width, height, id) {
        super(x, y, width, height);
    
        this.id = id;

    }
}

Game.World.Collider = class {
    constructor() {



    }

    collide(object) {



    }

}

export default Game;
