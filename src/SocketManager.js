const { log } = require("console");

class SocketManager {
    constructor() {
        this.active_rooms = {};
        this.players = { socket: null, room: null };
        this.verbose = false;
    }

    add_player(playerId, socket) {
        if (this.players[playerId]) return;
        this.players[playerId] = { socket, room: null };
        this.logSocket(`User ${playerId} connected`);
    }

    remove_player(playerId) {
        delete this.players[playerId];
        this.logSocket(`User ${playerId} disconnected`);
    }

    get_rooms() {
        return this.active_rooms;
    }

    get_room(roomName) {
        return this.active_rooms[roomName];
    }

    add_room(roomName) {
        if (this.active_rooms[roomName]) return;
        this.active_rooms[roomName] = [];
        this.logSocket(`Room ${roomName} created`);
    }

    remove_room(roomName) {
        delete this.active_rooms[roomName];
        this.logSocket(`Room ${roomName} removed`);
    }

    add_player_to_room(roomName, playerId) {
        if (this.active_rooms[roomName].indexOf(playerId) !== -1) return;
        this.active_rooms[roomName].push(playerId);
        this.players[playerId].room = roomName;
        this.logSocket(`User ${playerId} joined room ${roomName}`);
    }

    remove_player_from_room(roomName, playerId) {
        if (!this.active_rooms[roomName]) return;
        const index = this.active_rooms[roomName].indexOf(playerId);
        if (index !== -1) {
            this.active_rooms[roomName].splice(index, 1);
            this.logSocket(`User ${playerId} left room ${roomName}`);
            if (this.active_rooms[roomName].length === 0) {
                this.remove_room(roomName);
            }
        }
        this.players[playerId].room = null;
    }

    get_rooms_info() {
        const roomsInfo = [];
        for (const room in this.active_rooms) {
            if (this.active_rooms.hasOwnProperty(room)) {
                roomsInfo.push({
                    roomName: room,
                    players: this.active_rooms[room],
                });
            }
        }
        return roomsInfo;
    }

    get_room_info(roomName) {
        if (!this.active_rooms[roomName]) return;
        return {
            roomName,
            players: this.active_rooms[roomName],
        };
    }

    get_player_room(playerId) {
        return this.players[playerId].room;
    }

    logSocket(txt) {
        if (this.verbose) console.log(`\u001b[36m[socket]\u001b[0m ${txt}`);
    }
}

module.exports = SocketManager;
