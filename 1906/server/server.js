const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { match } = require("assert");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

setInterval(() => {
  io.emit("updateMMplayerCounter", matchmaking.length);
}, 500);

const clients = [];
const matchmaking = [];
const gamelobbies = [];

class gamelobby {
  constructor(socket1, socket2) {
    this.P1 = socket1;
    this.P2 = socket2;
  }
}

function printMMqueue() {
  console.log("Clients in matchmaking queue:");
  if (matchmaking.length <= 0) console.log("No clients :(");
  else for (let elem of matchmaking) console.log(`${elem.id}`);
}

io.on("connection", (socket) => {
  clients.push(socket);
  console.log(`A client connected with id ${socket.id}`);
  socket.on("matchmakeRequest", () => {
    // add a client if they're not in the matchmaking queue
    let alreadyIn = false;
    console.log(`${socket.id} has sent a matchmaking request`);
    for (let i = 0; i < matchmaking.length && !alreadyIn; i++) {
      alreadyIn = matchmaking[i].id == socket.id ? true : false;
    }
    if (!alreadyIn) {
      matchmaking.push(socket);
      socket.emit("joinedMM");
    } else socket.emit("alreadyInMM");

    printMMqueue();

    // start a match if there are at least 2 clients in matchmaking queue
    if (matchmaking.length >= 2) {
      let randI = Math.floor(Math.random() * matchmaking.length);
      
    }
  });
  socket.on("leaveMMrequest", () => {
    console.log(`${socket.id} has sent a 'leave matchmaking queue' request`);
    let index = matchmaking.indexOf(socket);
    if (index > -1) {
      matchmaking.splice(index, 1);
      console.log(`${socket.id} left matchmaking`);
      socket.emit("leftMM");
    }
    printMMqueue();
  });
  socket.on("disconnect", () => {
    console.log(`Client with id ${socket.id} has disconnected`);
    let index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
      console.log(`${socket.id} removed from client list`);
    }
    index = matchmaking.indexOf(socket);
    if (index > -1) {
      matchmaking.splice(index, 1);
      console.log(`${socket.id} left matchmaking due to disconnection`);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on localhost:${server.address().port}`);
});
