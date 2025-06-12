const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log(`Usuario Actual ${socket.id}`);

    socket.on("join_room", ({username, room}) => {
        socket.join(room);
        console.log(`Usuario ${username} con id ${socket.id} ha entrado a la sala ${room}`)
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running");
});

