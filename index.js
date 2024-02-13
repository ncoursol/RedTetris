const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const path = require("path");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeRooms = {};

io.on("connection", (socket) => {
  console.log(
    `\u001b[36m[socket]\u001b[0m User \u001b[33m${socket.id}\u001b[32m connected\u001b[0m`
  );

  socket.on("join_or_create_room", (roomName) => {
    socket.join(roomName);
    const playerId = socket.id;

    if (activeRooms[roomName]) {
      // If the room already exists, join it
      const index = activeRooms[roomName].indexOf(playerId);
      if (index === -1) {
        activeRooms[roomName].push(playerId);
        console.log(
          `\u001b[36m[socket] \u001b[0mUser \u001b[33m${playerId}\u001b[0m joined room \u001b[33m${roomName}\u001b[0m as player ${activeRooms[roomName].length}`
        );
      }
    } else {
      // If the room doesn't exist, create it and join
      activeRooms[roomName] = [playerId];
      console.log(
        `\u001b[36m[socket] \u001b[0mRoom \u001b[33m${roomName}\u001b[0m created and user \u001b[33m${playerId}\u001b[0m joined as master player 1`
      );
    }
    io.emit("rooms_info", getRoomsInfo());
  });

  socket.on("disconnect", () => {
    console.log(
      `\u001b[36m[socket]\u001b[0m User \u001b[33m${socket.id}\u001b[31m disconnected\u001b[0m`
    );
    // Remove disconnected user from active rooms
    for (const room in activeRooms) {
      if (activeRooms.hasOwnProperty(room)) {
        const index = activeRooms[room].indexOf(socket.id);
        if (index !== -1) {
          activeRooms[room].splice(index, 1);
          // If no players left in the room, remove it
          if (activeRooms[room].length === 0) {
            delete activeRooms[room];
            console.log(
              `\u001b[36m[socket] \u001b[0mRoom \u001b[33m${room}\u001b[0m removed`
            );
          }
        }
      }
    }
    io.emit("rooms_info", getRoomsInfo());
  });
});

function getRoomsInfo() {
  const roomsInfo = [];
  for (const room in activeRooms) {
    if (activeRooms.hasOwnProperty(room)) {
      roomsInfo.push({
        roomName: room,
        players: activeRooms[room],
      });
    }
  }
  return roomsInfo;
}

app.use(express.static("dist"));

app.get("/", function (req, res) {
  const filePath = path.join(__dirname, "dist", "index.html");
  res.sendFile(filePath);
});

server.listen(3000, () => {
  console.log("\nlistening on *:3000");
});
