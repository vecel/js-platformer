

class Game {
    constructor() {

        this.level = {

            backgroundColor: '#777',
            height: 80,
            width: 128,

            world: new Game.World(),

            init: function () {

                this.world.init();

            },

            update: function () {

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
        this.velocity    = 3;

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

        this.velocityX = -this.velocity;

    }

    moveRight() {

        this.velocityX = this.velocity;

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
        this.tileSize  = 16;

        this.map = [];

        this.player = new Game.Player();

        this.gravity = 3;
        this.friction = 0.7;

        this.offsetX = 0;
        this.offsetY = 0;

        this.width  = this.columns * this.tileSize;
        this.height = this.rows * this.tileSize;

    }

    init() {

        this.initMap();

    }

    initMap() {

        for (let i = 0; i <= this.mapSketch.length; ++i) {
            if (this.mapSketch[i] === 'X')
                this.map.push(new Game.Tile((i % this.columns) * this.tileSize, Math.floor(i / this.columns) * this.tileSize, this.tileSize, this.tileSize, this.mapSketch[i]));
        }
        console.log(this.map);

    }

    collideObject(object) {

        /**
             * object's velocityX is rounded so that tile map is moving smoothly,
             * otherwise tiles move by nondecimal values and then graphics isn't
             * rendered in solid color, but it has stripes in different color
        */

        if (object.getLeft() < 8) { 

            this.offsetX += Math.round(-object.velocityX);
            object.setLeft(8);
            object.velocityX = 0;

        }
        if (object.getRight() > this.width - 8) { 

            this.offsetX += Math.round(-object.velocityX);
            object.setRight(this.width - 8);
            object.velocityX = 0;

        }
        if (object.getTop() < 8) { 
        
            this.offsetY += Math.round(-object.velocityY);
            object.setTop(8);
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
