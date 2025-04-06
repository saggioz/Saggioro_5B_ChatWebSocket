const fs = require('fs');
const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const { Server } = require('socket.io');
const conf = JSON.parse(fs.readFileSync("./conf.json"));
const port = conf.port

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use("/", express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const io = new Server(server);

let userList = [];

io.on('connection', (socket) => {
   console.log("socket connected: " + socket.id);

   socket.on('setName', (name) => {
      userList.push({ socketId: socket.id, name: name });
      io.emit("list", userList);
   });

   socket.on('message', (message) => {
      const user = userList.find(user => user.socketId === socket.id);
      const response = user ? user.name + ': ' + message : message;
      console.log(response);
      io.emit("chat", response);
   });

   socket.on('disconnect', () => {
      userList = userList.filter(user => user.socketId !== socket.id);
      io.emit("list", userList);
   });
});
server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});