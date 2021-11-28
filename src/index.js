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
            game.world.height / game.world.width);
        display.render();

    };

    const render = function () {

        display.fill(game.world.backgroundColor);
        display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.render();

    }

    const update = function () {

        if (controller.left.active)  { game.world.player.moveLeft(); }
        if (controller.right.active) { game.world.player.moveRight(); }
        if (controller.up.active)    { game.world.player.jump(); controller.up.active = false; }

        game.update();

    };





    let controller = new Controller();

    let display    = new Display(document.querySelector('canvas'));

    let game       = new Game();

    let engine     = new Engine(1000 / 30, update, render);

    display.buffer.canvas.width = game.world.width;
    display.buffer.canvas.height = game.world.height;

    window.addEventListener('keydown', keyDownUp);
    window.addEventListener('keyup',   keyDownUp);
    window.addEventListener('resize',  resize);

    resize();
    engine.start();

});
