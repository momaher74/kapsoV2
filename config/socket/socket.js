const { Server } = require("socket.io");

let io; // Declare io variable globally

function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*", // Allow all origins (change for production)
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🟢 New client connected:", socket.id);

        socket.on("message", (data) => {
            console.log("📩 New message:", data);
            io.emit("message", data);
        });

        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected:", socket.id);
        });
    });
}

function getSocketInstance() {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
}

module.exports = { initSocket, getSocketInstance };
