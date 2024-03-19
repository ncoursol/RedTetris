const { log } = require("console");

class SocketManager {
    constructor() {
        this.active_rooms = {};
        this.players = {};
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

    add_room(roomName) {
        if (this.active_rooms[roomName]) return;
        this.active_rooms[roomName] = [];
        this.active_rooms[roomName].state = "waiting";
        this.logSocket(`Room ${roomName} created`);
    }

    remove_room(roomName) {
        delete this.active_rooms[roomName];
        this.logSocket(`Room ${roomName} removed`);
    }

    add_player_to_room(roomName, playerId, username) {
        if (this.active_rooms[roomName].indexOf(playerId) !== -1) return;
        this.active_rooms[roomName].push(playerId);
        this.players[playerId].room = roomName;
        this.players[playerId].username = username;
        this.logSocket(`User ${playerId}(${username}) joined room ${roomName}`);
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

    get_players_info(roomName) {
        const playersInfo = [];
        for (const playerId of this.active_rooms[roomName]) {
            if (this.players[playerId]) {
                playersInfo.push({
                    playerId,
                    username: this.players[playerId].username,
                });
            }
        }
        return playersInfo;
    }

    get_rooms_info() {
        const roomsInfo = [];
        for (const room in this.active_rooms) {
            if (this.active_rooms[room].length === 0) this.remove_room(room);
            else {
                roomsInfo.push({
                    roomName: room,
                    players: this.get_players_info(room),
                    state: this.active_rooms[room].state,
                });
            }
        }
        return roomsInfo;
    }

    get_room_info(roomName) {
        if (!this.active_rooms[roomName]) return;
        return {
            roomName,
            players: this.get_players_info(roomName),
            state: this.active_rooms[roomName].state,
        };
    }

    set_room_state(roomName, roomState) {
        if (!this.active_rooms[roomName]) return;
        this.active_rooms[roomName].state = roomState;
    }

    get_player_room(playerId) {
        return this.players[playerId]?.room;
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

module.exports = SocketManager;
