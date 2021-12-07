/* eslint-disable */

import Controller from './controller';
import Display from './display';
import Game from './game';
import Engine from './engine';

window.addEventListener('load', (event) => {

    const keyDownUp = function (event) {

        controller.keyDownUp(event.type, event.keyCode);

    };

    const resize = function () {

        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, 
            game.level.height / game.level.width);
        display.render();

    };

    const render = function () {

        display.fill(game.level.backgroundColor);
        // jakos ladniej to ogarnac
        game.level.world.map.forEach(tile => {
            display.drawTile(tile.x + tile.offsetX, tile.y + tile.offsetY, game.level.world.tileWidth, game.level.world.tileHeight, tile.id);
        });
        display.drawRectangle(game.level.player.x, game.level.player.y, game.level.player.width, game.level.player.height, game.level.player.color);
        
        display.render();

    }

    const update = function () {

        if (controller.left.active)  { game.level.player.moveLeft(); }
        if (controller.right.active) { game.level.player.moveRight(); }
        if (controller.up.active)    { game.level.player.jump(); controller.up.active = false; }

        game.update();

    };





    let controller = new Controller();

    let display    = new Display(document.querySelector('canvas'));

    let game       = new Game();

    let engine     = new Engine(1000 / 30, update, render);

    display.buffer.canvas.width = game.level.width;
    display.buffer.canvas.height = game.level.height;

    window.addEventListener('keydown', keyDownUp);
    window.addEventListener('keyup',   keyDownUp);
    window.addEventListener('resize',  resize);

    resize();
    game.level.world.initMap(game.level.world.columns, game.level.world.tileWidth, game.level.world.tileHeight);
    engine.start();

});
