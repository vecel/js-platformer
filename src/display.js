class Display {
    constructor(canvas) {

        this.buffer = document.createElement('canvas').getContext('2d');
        this.context = canvas.getContext('2d');

    }

    drawRectangle(x, y, width, height, color) {

        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height);

    }

    drawMap(tileMap, rows, columns, offsetX, offsetY) {

        this.buffer.fillStyle = '#f0f';
        for (let i = 0; i < tileMap.length; ++i) {

            if (tileMap[i] === 'X') {

                this.buffer.fillRect((i % columns) * 16 + offsetX, Math.floor(i / columns) * 16 + offsetY, 16, 16);

            }

        }

    }

    fill(color) {

        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);

    }

    render() {

        this.context.drawImage(
            this.buffer.canvas,
            0,
            0,
            this.buffer.canvas.width,
            this.buffer.canvas.height,
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
            );

    }

    resize(width, height, ratio) {

        if (height / width > ratio) {

            this.context.canvas.height = width * ratio;
            this.context.canvas.width = width;

        } else {

            this.context.canvas.height = height;
            this.context.canvas.width = height / ratio;

        }

        this.context.imageSmoothingEnabled = false;

    }
}

// Display.TileSheet = class {

// }

export default Display;
