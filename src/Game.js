const Piece = require("./Piece");

class Game {
    #tickInterval;
    #framePerLine;
    #frameCounter;
    #roomName;
    #io;

    constructor(players, nb_players) {
        this.#tickInterval = null;
        this.#framePerLine = [60, 50, 40, 30, 20, 10, 8, 6, 4, 2, 1];
        //this.#framePerLine = [20, 10, 8, 6, 4, 2, 1];
        this.#frameCounter = 0;
        this.#roomName = null;
        this.#io = null;

        this.gameDuration = 0;
        this.level = 0;
        
        this.players = players;
        this.nb_players = nb_players;

        this.grids = {};
        this.pieceStack = [];
    }
    
    start(io, roomName) {
        this.#io = io;
        this.#roomName = roomName;
        this.initGrids();
        this.addBagToStack();
        this.#tickInterval = setInterval(() => {
            this.#frameCounter++;
            if (this.#frameCounter % this.#framePerLine[this.level] === 0) {
                this.tick();
            }
            if (this.#frameCounter % 60 === 0) {
                this.#frameCounter = 0;
                this.gameDuration++;
                this.level = Math.floor(
                    Math.max(1, Math.floor(this.gameDuration + 30) / 20) - 1
                );
            }
        }, 1000 / 60);
    }

    pause() {
        clearInterval(this.#tickInterval);
    }

    stop() {
        this.gameDuration = 0;
        this.level = 0;
        this.#frameCounter = 0;
        clearInterval(this.#tickInterval);
    }

    tick() {
        console.log("tick", this.gameDuration, this.level);
        for (let player in this.players) {
            if (this.players[player].piece != null) {
                this.players[player].piece.move(0, 1);
                if (this.checkCollision(player)) {
                    this.players[player].piece.move(0, -1);
                    this.addPieceToGrid(player);
                    this.players[player].piece = null;
                }
            }
            if (this.players[player].piece === null) {
                this.spawnPiece(player);
            }
        }
        this.sendGridsRendering();
    }
    
    sendGridsRendering() {
        let rGrids = {};
        for (let player in this.players) {
            rGrids[player] = JSON.parse(JSON.stringify(this.grids[player]));
            if (this.players[player].piece !== null) {
                this.addPieceToGrid(player, rGrids[player]);
            }
        }
        this.#io.to(this.#roomName).emit("grids", rGrids);
    }

    initGrids() {
        let grids = {};
        for (let player in this.players) {
            grids[player] = [];
            for (let i = 0; i < 21; i++) {
                grids[player].push([]);
                for (let j = 0; j < 10; j++) {
                    grids[player][i].push('black');
                }
            }
        }
        this.grids = grids;
    }

    spawnPiece(player) {
        if (this.players[player].stackPos > this.pieceStack.length - 1)
            this.addBagToStack();
        const piece = this.pieceStack[this.players[player].stackPos++];

        this.players[player].piece = new Piece(piece);

        if (this.checkCollision(player)) {
            console.log("game over");
            this.stop();
        }
    }

    checkCollision(player) {
        const piece = this.players[player].piece;
        const shape = piece.shape[piece.currentShape];
        const grid = this.grids[player];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    if ((piece.y + y) > 20 || (piece.y + y) < 0)
                        return true;
                    if ((piece.x + x) > 9 || (piece.x + x) < 0)
                        return true;
                    if (grid[piece.y + y][piece.x + x] !== 'black') {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    keyboardMove(move, player) {
        if (this.players[player].piece === null) {
            return;
        }
        switch (move) {
            case "up":
                this.players[player].piece.rotate(1, this.checkCollision.bind(this, player));
                this.sendGridsRendering();
                break;
            case "down":
                this.players[player].piece.move(0, 1);
                if (this.checkCollision(player)) {
                    this.players[player].piece.move(0, -1);
                    this.addPieceToGrid(player);
                    this.players[player].piece = null;
                }
                this.sendGridsRendering();
                break;
            case "left":
                this.players[player].piece.move(-1, 0);
                if (this.checkCollision(player)) {
                    this.players[player].piece.move(1, 0);
                } else {
                    this.sendGridsRendering();
                }
                break;
            case "right":
                this.players[player].piece.move(1, 0);
                if (this.checkCollision(player)) {
                    this.players[player].piece.move(-1, 0);
                } else {
                    this.sendGridsRendering();
                }
                break;
            case "space":
                while (!this.checkCollision(player)) {
                    this.players[player].piece.move(0, 1);
                }
                this.players[player].piece.move(0, -1);
                this.addPieceToGrid(player);
                this.players[player].piece = null;
                this.sendGridsRendering();
                break;
        }
    }

    addPieceToGrid(player, grid = this.grids[player]) {
        const piece = this.players[player].piece;
        const shape = piece.shape[piece.currentShape];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    grid[piece.y + y][piece.x + x] = piece.color;
                }
            }
        }
    }

    randomBagGeneration() {
        let randomBag = [0, 1, 2, 3, 4, 5, 6];
        for (let i = randomBag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomBag[i], randomBag[j]] = [randomBag[j], randomBag[i]];
        }
        return randomBag;
    }

    addBagToStack() {
        this.pieceStack = this.pieceStack.concat(this.randomBagGeneration());
    }
}

module.exports = Game;