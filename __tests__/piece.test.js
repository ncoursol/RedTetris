const Piece = require("../src/Piece");
const { TETRIMINOS, WALL_KICKS } = require("../src/Constantes");

let piece;
let index;
let tmpx, tmpy;

describe("Piece", () => {
    beforeAll(() => {
        index = Math.floor(Math.random() * Object.keys(TETRIMINOS).length);
        piece = new Piece(index);
        tmpx = piece.x;
        tmpy = piece.y;
    });

    it("should create a Piece object", () => {
        expect(piece.x).toBe(index === 1 ? 4 : 3);
        expect(piece.y).toBe(index === 0 ? 0 : 1);
        expect(piece.color).toBe(TETRIMINOS[index].color);
        expect(piece.shape).toEqual(TETRIMINOS[index].shape);
        expect(piece.currentShape).toBe(0);
        expect(piece.index).toBe(index);
    });

    it("should move the piece", () => {
        let x = Math.floor(Math.random() * 3) - 1;
        let y = Math.floor(Math.random() * 3) - 1;
        piece.move(x, y);
        expect(piece.x).toBe(tmpx + x);
        expect(piece.y).toBe(tmpy + y);
    });

    it("should rotate the piece when no collision", () => {
        piece.rotate(1, () => true);
        if (piece.index !== 1)
            expect(piece.currentShape).toBe(0);
    });

    it("should not rotate the piece when collision", () => {
        piece.rotate(1, () => false);
        if (piece.index !== 1)
            expect(piece.currentShape).toBe(1);
    });
});