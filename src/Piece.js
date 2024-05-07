const { TETRIMINOS } = require("./Constantes");

class Piece {
    constructor(index) {
        this.x = index === 1 ? 4 : 3;
        this.y = index === 0 ? 0 : 1;
        this.color = TETRIMINOS[index].color;
        this.shape = TETRIMINOS[index].shape;
        this.currentShape = 0;
    }

    move(x, y) {
        this.x += x;
        this.y += y;
    }
}

module.exports = Piece;