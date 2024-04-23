const socket = require("socket.io");

class Game {
    #tickInterval;
    #framePerLine;
    #frameCounter;

    constructor(players) {
        this.#tickInterval = null;
        this.#framePerLine = [60, 50, 40, 30, 20, 10, 8, 6, 4, 2, 1];
        this.#frameCounter = 0;

        this.gameDuration = 0;
        this.level = 0;
        this.grids = {};
        this.players = players;
        this.nb_players = Object.keys(players).length;
    }
    
    start(io, roomName) {
        this.initGrids();
        this.#tickInterval = setInterval(() => {
            this.#frameCounter++;
            if (this.#frameCounter % this.#framePerLine[this.level] === 0) {
                this.tick(io, roomName);
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

    tick(io, roomName) {
        console.log("tick", this.gameDuration, this.level);
        io.to(roomName).emit("grids", this.grids);
    }

    initGrids() {
        let grids = {};
        for (let player in this.players) {
            grids[player] = [];
            for (let i = 0; i < 21; i++) {
                grids[player].push([]);
                for (let j = 0; j < 10; j++) {
                    grids[player][i].push(0);
                }
            }
        }
        this.grids = grids;
    }
}

module.exports = Game;