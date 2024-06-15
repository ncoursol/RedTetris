const Piece = require("./Piece");

class Game {
    #tickInterval;
    #framePerLine;
    #frameCounter;
    #lineScore;
    #roomName;
    #io;

    constructor(players, nb_players) {
        this.#tickInterval = null;
        this.#framePerLine = [
            60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 8, 6, 4, 2, 1,
        ];
        this.#frameCounter = 0;

        this.#lineScore = [100, 300, 500, 800];

        this.#roomName = null;
        this.#io = null;

        this.gameDuration = 0;
        this.level = 0;

        this.players = players;
        this.nb_players = nb_players;
        
        this.grids = {};
        this.pieceStack = [];
        
        this.isRunning = false;
        this.isOver = false;
    }
    
    
    init(io, roomName) {
        this.#io = io;
        this.#roomName = roomName;
        this.#frameCounter = 0;
        this.#tickInterval = null;
        this.gameDuration = 0;
        this.level = 0;
        this.isOver = false;
        this.isRunning = false;
        this.isOver = false;
        this.pieceStack = [];
        for (let player in this.players) {
            this.players[player].piece = null;
            this.players[player].stackPos = 0;
            this.players[player].score = 0;
            this.players[player].lockLines = 0;
            this.players[player].status = 0;
        }
        this.initGrids();
        this.addBagToStack();
        this.start();
    }
    
    initGrids() {
        let grids = {};
        for (let player in this.players) {
            grids[player] = [];
            for (let i = 0; i < 21; i++) {
                grids[player].push([]);
                for (let j = 0; j < 10; j++) {
                    grids[player][i].push(["black", "null"]);
                }
            }
        }
        this.grids = grids;
    }

    start() {
        if (this.pieceStack.length === 0) {
            this.init(this.#io, this.#roomName);
        }
        if (!this.isOver) {
            this.isRunning = true;
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
    }
    
    pause() {
        this.isRunning = false;
        clearInterval(this.#tickInterval);
    }
    
    gameOver(player) {
        this.players[player].piece = null;
        this.players[player].status = 1;
        if (
            Object.values(this.players).every((player) => player.status === 1)
        ) {
            this.isOver = true;
            this.pause();
        } else {
            let alive = 0;
            for (let player in this.players) {
                if (this.players[player].status === 0) {
                    alive++;
                }
            }
            if (alive === 1 && this.nb_players > 1) {
                this.isOver = true;
                this.pause();
            }
        }
    }
    
    stop() {
        this.initGrids();
        clearInterval(this.#tickInterval);
        for (let player in this.players) {
            this.players[player].piece = null;
            this.players[player].status = 0;
            this.players[player].score = 0;
        }
        this.sendGridsRendering();
    }
    
    tick() {
        console.log("tick", this.gameDuration, this.level);
        for (let player in this.players) {
            if (this.players[player].status === 0) {
                if (
                    this.players[player].piece != null &&
                    !this.checkCollision(player)
                ) {
                    this.players[player].piece.move(0, 1);
                    if (this.checkCollision(player)) {
                        this.players[player].piece.move(0, -1);
                        this.addPieceToGrid(player, 0);
                        this.players[player].piece = null;
                    }
                }
                if (this.players[player].piece === null) {
                    this.spawnPiece(player);
                }
            }
        }
        this.sendGridsRendering();
    }
    
    changeNumberOfPlayers(players) {
        this.players = players;
        this.nb_players = Object.keys(players).length;
    }
    
    sendGridsRendering() {
        let rGrids = {};
        for (let player in this.players) {
            let username = this.players[player].username;
            rGrids[username] = JSON.parse(JSON.stringify(this.grids[player]));
            if (
                this.players[player].piece !== null &&
                !this.checkCollision(player)
            ) {
                this.drawShadow(
                    this.players[player].piece,
                    rGrids[username],
                    player
                );
                this.addPieceToGrid(player, 0, rGrids[username]);
            }
        }
        this.#io.to(this.#roomName).emit("grids", rGrids);
        this.#io.to(this.#roomName).emit("scores", this.scoreGrid());
    }

    drawShadow(piece, grid, player) {
        if (this.checkCollision(player)) {
            return;
        }
        const tmp = [piece.x, piece.y];
        while (!this.checkCollision(player)) {
            piece.move(0, 1);
        }
        piece.move(0, -1);
        this.addPieceToGrid(player, 1, grid);
        piece.x = tmp[0];
        piece.y = tmp[1];
    }

    lockLines(player, nb_lines) {
        for (let opponent in this.players) {
            if (opponent !== player && this.players[opponent].status === 0) {
                for (let i = 0; i < nb_lines; i++) {
                    this.grids[opponent][
                        20 - i - this.players[opponent].lockLines
                    ] = new Array(10).fill(["gray", "lock"]);
                    if (this.players[opponent].piece !== null && this.checkCollision(opponent)) {
                        this.addPieceToGrid(opponent, 0);
                        this.grids[opponent][
                            20 - i - this.players[opponent].lockLines
                        ] = new Array(10).fill(["gray", "lock"]);
                        this.players[opponent].piece = null;
                    }
                }
                this.players[opponent].lockLines += nb_lines;
                if (this.players[opponent].lockLines >= 20) {
                    this.gameOver(opponent);
                }
            }
        }
    }

    scoreGrid() {
        let scores = {};
        let sorted = Object.keys(this.players).sort(
            (a, b) => this.players[b].score - this.players[a].score
        );
        for (let i = 0; i < this.nb_players; i++) {
            let player = sorted[i];
            scores[this.players[player].username] = {};
            scores[this.players[player].username].score =
                this.players[player].score;
            scores[this.players[player].username].status =
                this.players[player].status;
        }
        return scores;
    }

    spawnPiece(player) {
        if (this.players[player].stackPos > this.pieceStack.length - 1)
            this.addBagToStack();
        const piece = this.pieceStack[this.players[player].stackPos++];
        this.players[player].piece = new Piece(piece);
        this.players[player].isLastTick = 0;

        if (this.checkCollision(player)) {
            this.players[player].piece.move(0, -1);
            if (this.checkCollision(player)) {
                this.gameOver(player);
            }
        }
    }

    checkCollision(player) {
        const piece = this.players[player].piece;
        const shape = piece.shape[piece.currentShape];
        const grid = this.grids[player];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    if (piece.y + y > 20 || piece.y + y < 0) return true;
                    if (piece.x + x > 9 || piece.x + x < 0) return true;
                    if (
                        grid[piece.y + y][piece.x + x][0] !== "black" &&
                        grid[piece.y + y][piece.x + x][1] !== "shadow"
                    ) {
                        return true;
                    }
                    if (grid[piece.y + y][piece.x + x][1] === "lock") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    keyboardMove(move, player) {
        if (
            this.players[player].piece === null ||
            this.checkCollision(player) ||
            this.players[player].status === 1 ||
            this.isRunning === false
        ) {
            return;
        }
        switch (move) {
            case "up":
                this.players[player].piece.rotate(
                    1,
                    this.checkCollision.bind(this, player)
                );
                this.sendGridsRendering();
                break;
            case "down":
                this.players[player].piece.move(0, 1);
                if (this.checkCollision(player)) {
                    this.players[player].piece.move(0, -1);
                    this.addPieceToGrid(player, 0);
                    this.players[player].piece = null;
                }
                this.players[player].score += 1;
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
                let down = 0;
                while (!this.checkCollision(player)) {
                    this.players[player].piece.move(0, 1);
                    down++;
                }
                this.players[player].score += (down - 1) * 2;
                this.players[player].piece.move(0, -1);
                this.addPieceToGrid(player, 0);
                this.players[player].piece = null;
                this.spawnPiece(player);
                this.sendGridsRendering();
                break;
        }
    }

    addPieceToGrid(player, type, grid = this.grids[player]) {
        const piece = this.players[player].piece;
        const shape = piece.shape[piece.currentShape];

        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x] === 1) {
                    if (type === 0)
                        grid[piece.y + y][piece.x + x] = [piece.color, "null"];
                    else if (type === 1) {
                        grid[piece.y + y][piece.x + x] = [
                            piece.color,
                            "shadow",
                        ];
                    }
                }
            }
        }
        this.checkLines(player);
    }

    checkLines(player) {
        const grid = this.grids[player];
        let lines = 0;
        for (let i = 0; i < grid.length; i++) {
            if (
                grid[i].every(
                    (cell) =>
                        cell[0] !== "black" &&
                        cell[1] !== "shadow" &&
                        cell[1] !== "lock"
                )
            ) {
                grid.splice(i, 1);
                grid.unshift(new Array(10).fill(["black", "null"]));
                lines++;
            }
        }

        if (lines > 0) {
            this.lockLines(player, lines);
            this.players[player].score +=
                this.#lineScore[lines - 1] * (this.level + 1);
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
