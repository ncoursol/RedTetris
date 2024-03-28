class Game {
    #tickInterval;
    #framePerLine;
    #frameCounter;

    constructor() {
        this.#tickInterval = null;
        this.gameDuration = 0;
        this.level = 0;
        this.#framePerLine = [60, 50, 40, 30, 20, 10, 8, 6, 4, 2, 1];
        this.#frameCounter = 0;
    }

    start() {
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
        // piece fall down by 1 block
    }
}

module.exports = Game;