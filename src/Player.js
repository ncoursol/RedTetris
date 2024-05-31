class Player {
    constructor(socketId, room) {
        this.playerId = socketId;
        this.room = room;
        this.username = '';

        this.piece = null;
        this.score = 0;
        this.stackPos = 0;
        this.lockLines = 0;
        this.status = 0;
    }
}

module.exports = Player;