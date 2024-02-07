const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const app = express();
const path = require('path');

app.use(cors());

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.static("dist"));

app.get("/", function (req, res) {
  const filePath = path.join(__dirname, "dist", "index.html");
  res.sendFile(filePath);
});

server.listen(3000, () => {
  console.log("\nlistening on *:3000");
});
