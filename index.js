const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const path = require("path");
const SocketManager = require("./src/SocketManager");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const manager = new SocketManager();

io.on("connection", (socket) => {
  manager.add_player(socket.id, socket);

  socket.on("disconnect", () => {
    manager.remove_player(socket.id);
  });

  socket.on("leave-room", () => {
    roomName = manager.get_player_room(socket.id);
    if (!roomName) return;
    manager.remove_player_from_room(roomName, socket.id);
    socket.leave(roomName);
    io.to(roomName).emit("room-info", manager.get_room(roomName));
  });

  socket.on("join-room", (roomName) => {
    manager.add_room(roomName);
    socket.join(roomName);
    manager.add_player_to_room(roomName, socket.id);
    io.emit("rooms-info", manager.get_rooms_info());
    io.to(roomName).emit("room-info", manager.get_room(roomName));
  });

  socket.on("delete-room", (roomName) => {
    manager.remove_room(roomName);
    io.emit("rooms-info", manager.get_rooms_info());
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