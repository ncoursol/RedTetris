const Player = require("./Player");
const Game = require("./Game");

class RoomManager {
    constructor() {
        this.active_rooms = {};
        this.players = {};
        this.verbose = false;
    }

    add_player(playerId, room) {
        if (this.players[playerId]) return;
        this.players[playerId] = new Player(playerId, room);
        this.logSocket(`User ${playerId} connected`);
    }

    remove_player(playerId) {
        delete this.players[playerId];
        this.logSocket(`User ${playerId} disconnected`);
    }

    add_room(roomName) {
        if (this.active_rooms[roomName]) return;
        this.active_rooms[roomName] = {};
        this.active_rooms[roomName].state = "stop";
        this.active_rooms[roomName].players = {};
        this.logSocket(`Room ${roomName} created`);
    }

    remove_room(roomName) {
        if (!this.active_rooms[roomName]) return;
        if (this.active_rooms[roomName].game && this.active_rooms[roomName].game.gameDuration > 0)
            this.active_rooms[roomName].game.stop();
        delete this.active_rooms[roomName].game;
        delete this.active_rooms[roomName];
        this.logSocket(`Room ${roomName} removed`);
    }

    add_player_to_room(roomName, playerId, username) {
        if (this.active_rooms[roomName].players[playerId])
            return;
        this.active_rooms[roomName].players[playerId] = this.players[playerId];
        this.players[playerId].room = roomName;
        this.players[playerId].username = username;
        this.logSocket(`User ${playerId}(${username}) joined room ${roomName}`);
        if (this.active_rooms[roomName].game)
            this.active_rooms[roomName].game.changeNumberOfPlayers(this.active_rooms[roomName].players);
    }

    remove_player_from_room(roomName, playerId, lobby) {
        if (!this.active_rooms[roomName]) return;
        if (this.active_rooms[roomName].players[playerId]) {
            delete this.active_rooms[roomName].players[playerId];
            this.logSocket(`User ${playerId} left room ${roomName}`);
            if (this.active_rooms[roomName].game)
                this.active_rooms[roomName].game.changeNumberOfPlayers(this.active_rooms[roomName].players);
            if (Object.keys(this.active_rooms[roomName].players).length === 0) {
                this.remove_room(roomName);
            }
        }
        this.players[playerId].room = lobby;
    }

    get_rooms_info(roomName = null) {
        if (roomName) {
            return this.active_rooms[roomName] ? this.active_rooms[roomName] : null;
        }
        return this.active_rooms;
    }

    set_room_state(roomName, roomState) {
        if (!this.active_rooms[roomName]) return;
        this.active_rooms[roomName].state = roomState;
        if (roomState === "start" && !this.active_rooms[roomName].game)
            this.active_rooms[roomName].game = new Game(this.active_rooms[roomName].players, Object.keys(this.active_rooms[roomName].players).length);
    }

    get_player_room(playerId) {
        return this.players[playerId] ? this.players[playerId].room : null;
    }

    get_player_room_by_username(username) {
        for (const playerId in this.players) {
            if (this.players[playerId].username === username) {
                return this.players[playerId].room;
            }
        }
        return null;
    }

    logSocket(txt) {
        if (this.verbose) console.log(`\u001b[36m[socket]\u001b[0m ${txt}`);
    }
}

module.exports = RoomManager;
