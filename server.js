const express = require('express');
const app = express();
const connectDB = require("./config/db_connection/mongo_db_connection.js");
const http = require("http").createServer(app); // Create HTTP server
const {initSocket} = require("./config/socket/socket"); // Import socket initializer
const port = 3000;
require('dotenv').config();

connectDB();

app.use(express.json());
const chat = "";
const auth = require("./features/auth/router/router")
app.use("/auth", auth)
app.get('/', (req, res) => res.send('Hello World!'));
app.get('*', (req, res) => res.send('This route not found'));


initSocket(http);

// 👉 Use `http.listen()` instead of `app.listen()`
http.listen(port, () => console.log(`🚀 Server listening on port ${port}!`));
