const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
require("dotenv").config('./.env');

const app = express();
let origin = "http://localhost:5173";

if (process.env.NODE_ENV === "production") {
    origin = process.env.FRONTEND_URL;
}
app.use(cors({
    origin,
}));
app.use(express.json());


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin,
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log('A User connected: ', socket.id);

    socket.on("CODE_CHANGED", (data) => {
        socket.broadcast.emit("CHANGE_CODE", data);
    })

    socket.on("CURSOR_POSITION_CHANGED", (data) => {
        console.log(socket.id, data);
        socket.broadcast.emit("CHANGE_CURSOR_POSITION", { userId: socket.id, position: data });
    })
});

app.get("/", (req, res) => {
    res.send({
        message: "Welcome to the server"
    });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});