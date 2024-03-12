const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const path = require("path");
const SocketManager = require("./src/SocketManager");

const LOBBY_ROOM = "lobby";

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

const manager = new SocketManager();
//manager.verbose = true;

io.on("connection", (socket) => {
    manager.add_player(socket.id, socket);
    socket.join(LOBBY_ROOM);

    socket.on("disconnect", () => {
        manager.remove_player(socket.id);
        socket.leave(LOBBY_ROOM);
    });

    socket.on("leave-room", () => {
        roomName = manager.get_player_room(socket.id);
        if (!roomName) return;
        manager.remove_player_from_room(roomName, socket.id);
        socket.to(roomName).emit("rooms-info", manager.get_room_info(roomName));
        socket.leave(roomName);
        socket.join(LOBBY_ROOM);
        socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
    });

    socket.on("join-room", (roomName, username, type, callback) => {
        if (roomName == "") {
            callback("Room name cannot be empty");
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
        } else {
            manager.add_room(roomName);
            manager.add_player_to_room(roomName, socket.id, username);
            socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
            socket.leave(LOBBY_ROOM);
            socket.join(roomName);
            socket
                .to(roomName)
                .emit("rooms-info", manager.get_room_info(roomName));
            callback("");
        }
    });

    socket.on("room-state", (roomName, roomState) => {
        if (
            manager.get_player_room(socket.id) != roomName ||
            !manager.active_rooms[roomName] ||
            manager.active_rooms[roomName].state == roomState
        )
            return;
        manager.set_room_state(roomName, roomState);
        if (roomState == "waiting" || roomState == "playing") {
            socket.to(LOBBY_ROOM).emit("rooms-info", manager.get_rooms_info());
            io.to(roomName).emit("rooms-info", manager.get_room_info(roomName));
        }
    });

    socket.on("delete-room", (roomName) => {
        manager.remove_room(roomName);
    });

    socket.on("get-rooms", (roomName) => {
        if (roomName) {
            io.to(socket.id).emit(
                "rooms-info",
                manager.get_room_info(roomName)
            );
        } else {
            io.to(socket.id).emit("rooms-info", manager.get_rooms_info());
        }
    });
});

app.use(express.static("dist"));

app.get("/", function (req, res) {
    const filePath = path.join(__dirname, "dist", "index.html");
    res.sendFile(filePath);
});

server.listen(3000, () => {
    console.log("\nlistening on localhost:3000");
});