const http = require("http");
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

const app = express();
app.use(morgan("combined"));
app.use(express.static("."));

//initialize a simple http server
const server = http.createServer(app);
const io = new Server(server);

function getTime() {
  const date = new Date();
  return (
    date.getMilliseconds() / 1000.0 +
    date.getSeconds() +
    date.getMinutes() * 60.0
  );
}

const clients = [];
const matchmaking = [];
const gamelobbies = [];

setInterval(() => {
  io.emit("updateMMplayerCounter", matchmaking.length);
}, 500);

setInterval(() => {
  for (let lobby of gamelobbies) lobby.gameStep();
}, 100);

function destroyLobby(lobby) {
  let index = gamelobbies.indexOf(lobby);
  if (index > -1) gamelobbies.splice(index, 1);
}

class gameboard {
  constructor() {
    this.a = [];
    for (let i = 0; i < 10; i++) this.a[i] = [];

    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) this.a[i][j] = "sea";
  }
  deploy(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return;
    this.a[y][x] = this.a[y][x] == "sea" ? "ship" : "sea";
  }
  boardOut(conceal) {
    let res = "";

    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) {
        if (conceal) {
          switch (this.a[i][j]) {
            case "sea":
            case "ship":
              res += "1";
              break;
            case "hit":
              res += "3";
              break;
            case "miss":
              res += "4";
              break;
            case "dead":
              res += "5";
              break;
          }
        } else {
          switch (this.a[i][j]) {
            case "sea":
              res += "0";
              break;
            case "ship":
              res += "2";
              break;
            case "hit":
              res += "3";
              break;
            case "miss":
              res += "4";
              break;
            case "dead":
              res += "5";
              break;
          }
        }
      }

    // console.log(res);
    return res;
  }
  checkCorners() {
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) {
        if (this.a[i][j] == "ship")
          if (
            (i > 0 && j > 0 && this.a[i - 1][j - 1] == "ship") ||
            (i > 0 && j < 9 && this.a[i - 1][j + 1] == "ship") ||
            (i < 9 && j > 0 && this.a[i + 1][j - 1] == "ship") ||
            (i < 9 && j < 9 && this.a[i + 1][j + 1] == "ship")
          )
            return false;
      }

    return true;
  }
  fullValidate() {
    if (this.checkCorners()) {
      // ship counters
      let ships = [];
      ships[0] = 0;
      ships[1] = 0;
      ships[2] = 0;
      ships[3] = 0;

      // array for cells with ships that were counted
      let checked = [];
      for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) checked[i * 10 + j] = false;

      for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) {
          if (this.a[i][j] != "ship" || checked[i * 10 + j]) continue;
          else {
            // there's a new ship
            checked[i * 10 + j] = true;
            let k;
            // see if it's horizontal
            for (k = 1; k != 5; k++) {
              if (j + k < 10 && this.a[i][j + k] == "ship")
                checked[i * 10 + j + k] = true;
              else break;
            }
            if (k == 5) return "shipTooLong";
            if (k > 1) {
              ships[k - 1]++;
              continue;
            }
            // see if it's vertical
            for (k = 1; k != 5; k++) {
              if (i + k < 10 && this.a[i + k][j] == "ship")
                checked[(i + k) * 10 + j] = true;
              else break;
            }
            if (k == 5) return "shipTooLong";
            if (k > 1) {
              ships[k - 1]++;
              continue;
            }
            ships[0]++;
          }
        }

      if (ships[3] != 1) return "4cellWrong";
      if (ships[2] != 2) return "3cellWrong";
      if (ships[1] != 3) return "2cellWrong";
      if (ships[0] != 4) return "1cellWrong";

      return "allGood";
    } else return "cornersWrong";
  }
  shootAt(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) return;
    if (this.a[y][x] == "ship") {
      this.a[y][x] = "hit";
      return "hit";
    } else if (this.a[y][x] == "sea") {
      this.a[y][x] = "miss";
      return "miss";
    } else if (this.a[y][x] == "miss" || this.a[y][x] == "hit") {
      return "shotThereAlready";
    }
  }
  isAlive() {
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) if (this.a[i][j] == "ship") return true;

    return false;
  }
}

class gamelobby {
  gameEnd(winningPlayer) {
    // return default callbacks
    this.P1.on("disconnect", () => {
      console.log(`Client with id ${this.P1.id} has disconnected`);
      let index = clients.indexOf(this.P1);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(`${this.P1.id} removed from client list`);
      }
      index = matchmaking.indexOf(this.P1);
      if (index > -1) {
        matchmaking.splice(index, 1);
        console.log(`${this.P1.id} left matchmaking due to disconnection`);
      }
    });
    this.P2.on("disconnect", () => {
      console.log(`Client with id ${this.P2.id} has disconnected`);
      let index = clients.indexOf(this.P2);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(`${this.P2.id} removed from client list`);
      }
      index = matchmaking.indexOf(this.P2);
      if (index > -1) {
        matchmaking.splice(index, 1);
        console.log(`${this.P2.id} left matchmaking due to disconnection`);
      }
    });

    // emit game end signal
    if (winningPlayer == 1) {
      this.P1.emit("gameEnd", "win");
      this.P2.emit("gameEnd", "lose");
    } else if (winningPlayer == 2) {
      this.P1.emit("gameEnd", "lose");
      this.P2.emit("gameEnd", "win");
    } else {
      this.P1.emit("gameEnd", "draw");
      this.P2.emit("gameEnd", "draw");
    }

    // destroy the lobby
    destroyLobby(this);
  }
  constructor(socket1, socket2) {
    // store player sockets
    this.P1 = socket1;
    this.P2 = socket2;
    // assign a board to each player
    this.board1 = new gameboard();
    this.board2 = new gameboard();
    // set first attacker
    this.attacker = 1;
    // assign new P1 client callbacks
    this.P1.on("disconnect", () => {
      console.log(`Client with id ${this.P1.id} has disconnected`);
      let index = clients.indexOf(this.P1);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(`${this.P1.id} removed from client list`);
      }
      this.P2.emit("opponentLeft");
      this.gameEnd(2);
    });
    this.P1.on("concedeRequest", () => {
      console.log(`Client with id ${this.P1.id} has left the game`);
      this.P1.emit("concedeSuccess");
      this.P2.emit("opponentConcede");
      this.gameEnd(2);
    });
    this.P1.on("gameDeploy", (x, y) => {
      if (this.phase != "Setup") return;
      this.board1.deploy(x, y);
      this.P1.emit("boardVerification", this.board1.fullValidate());
    });
    this.P1.on("gameAttack", (x, y) => {
      if (this.phase != "Battle") return;
      if (this.attacker == 1) {
        let shotStatus = this.board2.shootAt(x, y);
        if (shotStatus == "miss") this.attacker = 2;
        this.P1.emit("shotFeedback", this.P2.id, shotStatus);
        this.P2.emit("shotFeedback", this.P2.id, shotStatus);
      }
    });

    // assign new P2 client callbacks
    this.P2.on("disconnect", () => {
      console.log(`Client with id ${this.P2.id} has disconnected`);
      let index = clients.indexOf(this.P2);
      if (index > -1) {
        clients.splice(index, 1);
        console.log(`${this.P2.id} removed from client list`);
      }
      this.P1.emit("opponentLeft");
      this.gameEnd(1);
    });
    this.P2.on("concedeRequest", () => {
      console.log(`Client with id ${this.P2.id} has left the game`);
      this.P2.emit("concedeSuccess");
      this.P1.emit("opponentConcede");
      this.gameEnd(1);
    });
    this.P2.on("gameDeploy", (x, y) => {
      if (this.phase != "Setup") return;
      this.board2.deploy(x, y);
      this.P2.emit("boardVerification", this.board2.fullValidate());
    });
    this.P2.on("gameAttack", (x, y) => {
      if (this.phase != "Battle") return;
      if (this.attacker == 2) {
        let shotStatus = this.board1.shootAt(x, y);
        if (shotStatus == "miss") this.attacker = 1;
        this.P1.emit("shotFeedback", this.P2.id, shotStatus);
        this.P2.emit("shotFeedback", this.P2.id, shotStatus);
      }
    });
  }
  gameStart() {
    // emit game start signal
    this.P1.emit("gameStart", this.P2.id);
    this.P2.emit("gameStart", this.P1.id);

    // start setup phase
    this.setphstTime = getTime();
    this.phase = "Setup";

    // emit setup phase start signal
    // this.P1.emit("gameSetupPhaseStart");
    // this.P2.emit("gameSetupPhaseStart");
  }
  gameStep() {
    switch (this.phase) {
      case "Setup":
        let setupTime = 30;
        this.P1.emit(
          "gameUpdate",
          Math.floor(setupTime - (getTime() - this.setphstTime)),
          this.phase,
          this.board1.boardOut(false),
          this.board2.boardOut(true)
        );
        this.P2.emit(
          "gameUpdate",
          Math.floor(setupTime - (getTime() - this.setphstTime)),
          this.phase,
          this.board2.boardOut(false),
          this.board1.boardOut(true)
        );
        if (setupTime - (getTime() - this.setphstTime) <= 0) {
          if (
            this.board1.fullValidate() == "allGood" &&
            this.board2.fullValidate() == "allGood"
          )
            this.phase = "Battle";
          else if (
            this.board1.fullValidate() != "allGood" &&
            this.board2.fullValidate() != "allGood"
          )
            this.gameEnd(0);
          else if (this.board1.fullValidate() != "allGood") this.gameEnd(2);
          else this.gameEnd(1);
        }
        break;
      case "Battle":
        this.P1.emit(
          "gameUpdate",
          this.attacker == 1 ? 1 : 2,
          this.phase,
          this.board1.boardOut(false),
          this.board2.boardOut(true)
        );
        this.P2.emit(
          "gameUpdate",
          this.attacker == 2 ? 1 : 2,
          this.phase,
          this.board2.boardOut(false),
          this.board1.boardOut(true)
        );
        if (!this.board1.isAlive() && !this.board2.isAlive()) this.gameEnd(0);
        else if (!this.board1.isAlive()) this.gameEnd(2);
        else if (!this.board2.isAlive()) this.gameEnd(1);
        break;
    }
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
      // pick player 1 and remove from matchmaking
      let randI = Math.floor(Math.random() * matchmaking.length);
      const P1 = matchmaking[randI];
      matchmaking.splice(randI, 1);
      console.log(`${socket.id} left matchmaking and entered a lobby`);

      // pick player 2 and remove from matchmaking
      randI = Math.floor(Math.random() * matchmaking.length);
      const P2 = matchmaking[randI];
      matchmaking.splice(randI, 1);
      console.log(`${socket.id} left matchmaking and entered a lobby`);

      // create new lobby and start the game
      const newlobby = new gamelobby(P1, P2);
      newlobby.gameStart();
      gamelobbies.push(newlobby);
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
