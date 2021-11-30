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

            update: function () {

                this.player.velocityY += this.world.gravity;
                this.player.velocityX *= this.world.friction;
                this.player.update();

                this.collideObject(this.player);

            }
        }

    }

    update() {

        this.level.update();

    }
}

Game.Player = class {
    constructor() {

        this.color       = '#f00';
        this.height      = 16;
        this.width       = 16;
        this.VELOCITY    = 3;

        this.jumpCounter = 0;
        this.velocityX   = 0;
        this.velocityY   = 0;
        this.x           = 50;
        this.y           = 100;

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

        this.map = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X',
                    'X', '.', '.', '.', 'X', '.', '.', 'X',
                    '.', '.', '.', 'X', '.', '.', '.', 'X',
                    'X', '.', '.', '.', 'X', 'X', '.', 'X',
                    'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'];

        this.gravity = 3;
        this.friction = 0.7;

        this.offsetX = 0;
        this.offsetY = 0;

    }

    moveHorizontally(offset) {

        this.offsetX += offset;

    }

    moveVertically(offset) {

        this.offsetY += offset;

    }
    
}

export default Game;
