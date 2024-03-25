class Player {
    constructor(socketId, room) {
        this.playerId = socketId;
        this.room = room;
        this.username = '';
    }
}

module.exports = Player;