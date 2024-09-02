const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const db = require("./models");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Sync database
db.sequelize.sync();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await db.Message.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

io.on("connection", async (socket) => {
  console.log("A user connected");

  try {
    // Retrieve the last 10 messages from the database
    const messages = await db.Message.findAll({
      order: [["timestamp", "DESC"]],
      limit: 10,
    });
    console.log("from server side ", messages.reverse());
    socket.emit("chat history", messages.reverse());
  } catch (err) {
    console.error("Error loading messages from database:", err);
  }
  socket.on("set username", (username) => {
    socket.username = username;
    console.log(username);
  });

  socket.on("chat message", async (msg) => {
    try {
      // Save message using Sequelize
      await db.Message.create({
        username: socket.username || "anonymous",
        message: msg,
      });
      // Broadcast the message to all connected users
      io.emit("chat message", { username: socket.username, msg });
      console.log("hello");
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
