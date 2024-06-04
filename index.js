const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const path = require("path");
const RoomManager = require("./src/RoomManager");

const LOBBY_ROOM = "lobby";

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const manager = new RoomManager();
//manager.verbose = true;

io.on("connection", (socket) => {
    manager.add_player(socket.id, LOBBY_ROOM);
    socket.join(LOBBY_ROOM);

    socket.on("leave-room", () => {
        roomName = manager.get_player_room(socket.id);
        if (!roomName) return;
        manager.remove_player_from_room(roomName, socket.id, LOBBY_ROOM);
        socket
            .to(roomName)
            .emit("rooms-info", manager.get_rooms_info(roomName));
        socket.leave(roomName);
        socket.join(LOBBY_ROOM);
        socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
    });

    socket.on("join-room", (roomName, username, type, callback) => {
        if (roomName == "") {
            callback("Room name cannot be empty");
        } else if (manager.get_player_room_by_username(username) == roomName) {
            callback("Username already in use");
        } else if (roomName == LOBBY_ROOM) {
            callback("Unauthorized room name");
        } else if (type == "create" && manager.active_rooms[roomName]) {
            callback("Room with this name already exists");
        } else if (roomName.length > 20) {
            callback("Room name cannot be longer than 20 characters");
        } else if (username == "") {
            callback("Username cannot be empty");
        } else if (username.length > 20) {
            callback("Username cannot be longer than 20 characters");
        } else if (username.includes(" ")) {
            callback("Username or room name cannot contain spaces");
        } else if (username.length < 3) {
            callback("Username must be at least 3 characters long");
        } else {
            manager.add_room(roomName);
            manager.add_player_to_room(roomName, socket.id, username);
            socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
            socket.leave(LOBBY_ROOM);
            socket.join(roomName);
            socket
                .to(roomName)
                .emit("rooms-info", manager.get_rooms_info(roomName));
            callback("");
        }
    });

    socket.on("move", (roomName, move) => {
        if (
            move != "up" &&
            move != "down" &&
            move != "left" &&
            move != "right" &&
            move != "space"
        ) {
            return;
        }
        if (
            !manager.active_rooms[roomName] ||
            manager.get_player_room(socket.id) != roomName
        )
            return;
        manager.active_rooms[roomName].game.keyboardMove(move, socket.id);
    });

    socket.on("room-state", (roomName, roomState) => {
        if (
            manager.get_player_room(socket.id) != roomName ||
            !manager.active_rooms[roomName] ||
            manager.active_rooms[roomName].state == roomState
        )
            return;
        let tmp = manager.active_rooms[roomName].state;
        manager.set_room_state(roomName, roomState);
        if (roomState == "stop" || roomState == "start") {
            socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
        }
        io.to(roomName).emit("rooms-info", manager.get_rooms_info(roomName));
        if (roomState == "start") {
            if (tmp == "stop")
                manager.active_rooms[roomName].game.init(io, roomName);
            else manager.active_rooms[roomName].game.start();
        } else if (roomState == "stop") {
            manager.active_rooms[roomName].game.stop();
        } else if (roomState == "pause") {
            manager.active_rooms[roomName].game.pause();
        }
    });

    socket.on("delete-room", (roomName) => {
        manager.remove_room(roomName);
    });

    socket.on("get-rooms", (roomName) => {
        if (roomName) {
            io.to(socket.id).emit(
                "rooms-info",
                manager.get_rooms_info(roomName)
            );
        } else {
            io.to(socket.id).emit("rooms-info", manager.get_rooms_info());
        }
    });
});

app.use(express.static(path.join(__dirname, "dist")));

app.get("/checkRoom/:room/:player_name", (req, res) => {
    const roomName = req.params.room;
    const playerName = req.params.player_name;

    if (!manager.active_rooms[roomName]) {
        return res.status(404).send("Room does not exist");
    }

    const playerRoom = manager.get_player_room_by_username(playerName);
    if (playerRoom !== roomName) {
        return res.status(403).send("Player is not in the room");
    }
    res.status(200).send("Room and player verified");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

server.listen(3000, () => {
    console.log("\nlistening on localhost:3000");
});
