

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

    setOldLeft(x)   { this.oldX = x; }
    setOldRight(x)  { this.oldX = x - this.width; }
    setOldTop(y)    { this.oldY = y; }
    setOldBottom(y) { this.oldY = y - this.height; }

    getOldLeft()   { return this.oldX; }
    getOldRight()  { return this.oldX + this.width; }
    getOldTop()    { return this.oldY; }
    getOldBottom() { return this.oldY + this.height; }
}

Game.Player = class extends Game.Rectangle {
    constructor() {
        super(32, 32, 16, 16); // initial player values

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

        this.oldX = this.x;
        this.oldY = this.y;

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
                            1, 0, 0, 0, 1, 0, 0, 1,
                            0, 0, 0, 1, 0, 0, 0, 1,
                            1, 0, 0, 0, 1, 1, 0, 1,
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

    }

    collideObject(object) {

        /**
             * object's velocityX is rounded so that tile map is moving smoothly,
             * otherwise tiles move by nondecimal values and then graphics isn't
             * rendered in solid color, but it has stripes in different color
        */

        if (object.getLeft() < 0) { 

            this.offsetX += Math.round(-object.velocityX);
            object.setLeft(0);
            object.velocityX = 0;

        }
        if (object.getRight() > this.width) { 

            this.offsetX += Math.round(-object.velocityX);
            object.setRight(this.width);
            object.velocityX = 0;

        }
        if (object.getTop() < 0) { 
        
            this.offsetY += Math.round(-object.velocityY);
            object.setTop(0);
            object.velocityY = 0;

        }
        if (object.getBottom() > this.height - 0) { 
            
            object.setBottom(this.height - 0.01);
            object.jumpCounter = 0; 
            object.velocityY = 0;

        }

        /**
         * left, right, top, bottom are computed correctly
         */
        let left, right, top, bottom, collisionValue;

        left            = Math.floor((object.getLeft() - this.offsetX) / this.tileSize);
        top             = Math.floor((object.getTop() - this.offsetY) / this.tileSize);
        collisionValue  = this.collisionMap[top * this.columns + left];

        // this.collider.collide(collisionValue, object, left * this.tileSize + this.offsetX, top * this.tileSize + this.offsetY, this.tileSize);

        right           = Math.floor((object.getRight() - this.offsetX) / this.tileSize);
        top             = Math.floor((object.getTop() - this.offsetY) / this.tileSize);
        collisionValue  = this.collisionMap[top * this.columns + right];

        // this.collider.collide(collisionValue, object, right * this.tileSize + this.offsetX, top * this.tileSize + this.offsetY, this.tileSize);

        left            = Math.floor((object.getLeft() - this.offsetX) / this.tileSize);
        bottom          = Math.floor((object.getBottom() - this.offsetY) / this.tileSize);
        collisionValue  = this.collisionMap[bottom * this.columns + left];

        // this.collider.collide(collisionValue, object, left * this.tileSize + this.offsetX, (bottom - 1) * this.tileSize + this.offsetY, this.tileSize);

        right           = Math.floor((object.getRight() - this.offsetX) / this.tileSize);
        bottom          = Math.floor((object.getBottom() - this.offsetY) / this.tileSize);
        collisionValue  = this.collisionMap[bottom * this.columns + right];

        // this.collider.collide(collisionValue, object, right * this.tileSize + this.offsetX, (bottom - 1) * this.tileSize + this.offsetY, this.tileSize);

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

    collide(collisionValue, object, tileX, tileY, tileSize) {

        switch (collisionValue) {

            case 1: if (this.collidePlatformTop(object, tileY)) return;
                    if (this.collidePlatformLeft(object, tileX)) return;
                    if (this.collidePlatformRight(object, tileX + tileSize)) return;
                    this.collidePlatformBottom(object, tileY + tileSize); break;

        }

    }

    collidePlatformLeft(object, tileLeft) {

        if (object.getRight() > tileLeft && object.getOldLeft() <= tileLeft) {

            // console.log('collide platform left');

            object.setRight(tileLeft - 0.01);
            object.velocityX = 0;
            
            return true;

        }

        return false;

    }

    collidePlatformRight(object, tileRight) {

        if (object.getLeft() < tileRight && object.getOldRight() >= tileRight) {

            // console.log('collide platform right');

            object.setLeft(tileRight + 0.01);
            object.velocityX = 0;

            return true;

        }

        return false;

    }

    collidePlatformTop(object, tileTop) {

        if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {

            // console.log('collide platform top');

            object.setBottom(tileTop - 0.01);
            object.velocityY = 0;
            object.jumpCounter = 0;

            return true;

        }

        return false;

    }

    collidePlatformBottom(object, tileBottom) {

        if (object.getTop() > tileBottom && object.getOldTop() <= tileBottom) {

            // console.log('collide platform bottom');

            object.setTop(tileBottom + 0.01);
            object.velocityY = 0;

            return true;

        }

        return false;

    }

}

export default Game;
