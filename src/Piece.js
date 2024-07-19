const { TETRIMINOS, WALL_KICKS } = require("./Constantes");

class Piece {
    constructor(index) {
        this.x = index === 1 ? 4 : 3;
        this.y = index === 0 ? 0 : 1;
        this.color = TETRIMINOS[index].color;
        this.shape = TETRIMINOS[index].shape;
        this.currentShape = 0;
        this.index = index;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }

    rotate(dir, checkCollision) {
        this.currentShape = (this.currentShape + dir) % this.shape.length;
        const wallKick = this.index === 0 ? WALL_KICKS['I'][this.currentShape] : WALL_KICKS['ALL'][this.currentShape];

        for (let i = 0; i < wallKick.length; i++) {
            const [x, y] = wallKick[i];
            this.x += x;
            this.y += y;
            if (!checkCollision()) {
                return;
            }
            this.x -= x;
            this.y -= y;
        }
        this.currentShape = (this.currentShape - dir) % this.shape.length;
    }
}

module.exports = Piece;