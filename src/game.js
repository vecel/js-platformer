/* eslint-disable */
class Game {
    constructor() {

        this.world = {
            backgroundColor: '#777',

            gravity: 3,
            player: new Game.Player(),

            height: 72,
            width: 128,

            collideObject: function (object) {

                if (object.x < 0) { object.x = 0; object.velocityX = 0; }
                if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocityX = 0; }
                if (object.y < 0) { object.y = 0; object.velocityY = 0; }
                if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocityY = 0; }
                
            },

            update: function () {

                this.player.velocityY += this.gravity;
                this.player.update();

                // apply friction
                this.collideObject(this.player);

            }
        }

    }

    update() {

        this.world.update();

    }
}

Game.Player = class {
    constructor() {

        this.color      = '#f00';
        this.height     = 16;
        this.width      = 16;
        this.jumping    = true;
        this.velocityX  = 0;
        this.velocityY  = 0;
        this.x          = 50;
        this.y          = 100;

    }

    jump() {

        if (this.jumping) return;

        this.velocityY -= 20;
        this.jumping = true;

    }

    moveLeft() {

        this.velocityX = -3;

    }

    moveRight() {

        this.velocityX = 3;

    }

    update() {

        this.x += this.velocityX;
        this.y += this.velocityY;

        this.velocityX = 0;

    }
}

export default Game;
