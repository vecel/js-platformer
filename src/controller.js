export class Controller {

    constructor() {

        this.left  = new Controller.ButtonInput();
        this.right = new Controller.ButtonInput();
        this.up    = new Controller.ButtonInput();

    }

    keyDownUp(type, keyCode) {

        let down = (type == 'keydown') ? true : false;

        switch (keyCode) {
            case 65:
            case 37: 
                this.left.getInput(down); break;
            case 68:
            case 39:
                this.right.getInput(down); break;
            case 87:
            case 38:
                this.up.getInput(down); break;
        }
    }

    
}

Controller.ButtonInput = class {
    constructor() {
        this.active = this.down = false;
    }

    getInput(down) {
        if (this.down != down) this.active = down;
        this.down = down;
    }
}
