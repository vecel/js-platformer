/* eslint-disable */

import Display from './display';
import Controller from './controller';

window.addEventListener('load', (event) => {

    const keyDownUp = function (event) {

        controller.keyDownUp(event.type, event.keyCode);

    };

    const update = function () {

        // if (controller.left.active) console.log("left");
        // if (controller.right.active) console.log("right");

    };



    let controller = new Controller();

    let display    = new Display(document.querySelector('canvas'));

    // let game       = new Game();

    // let engine     = new Engine();


    window.addEventListener('keydown', keyDownUp);
    window.addEventListener('keyup',   keyDownUp);
    window.addEventListener('resize',  resize);

});
