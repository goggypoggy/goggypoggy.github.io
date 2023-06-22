function getTime() {
  const date = new Date();
  return (
    date.getMilliseconds() / 1000.0 +
    date.getSeconds() +
    date.getMinutes() * 60.0
  );
}

class time {
  constructor() {
    this.start = this.old = this.oldFPS = getTime();
    this.paused = 0;
    this.frameCounter = 0;
    this.FPS = 30.0;
    this.global = 0;
    this.globalDelta = 0;
    this.local = 0;
    this.localDelta = 0;
    this.isPaused = false;
  }
  response() {
    let curTime = getTime();

    this.global = curTime - this.start;
    this.globalDelta = curTime - this.old;

    if (this.isPaused) {
      this.localDelta = 0;
      this.paused += curTime - this.old;
    } else {
      this.localDelta = this.globalDelta;
      this.local = this.global - this.paused;
    }

    this.frameCounter++;
    if (curTime - this.oldFPS > 1) {
      this.FPS = this.frameCounter / (curTime - this.oldFPS);
      this.oldFPS = curTime;
      this.frameCounter = 0;
    }

    this.old = curTime;
  }
}

class vec2 {
  constructor(x, y) {
    this.x = x, this.y = y;
  }
  divNum(num) {
    return new vec2(this.x / num, this.y / num);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  len() {
    return Math.sqrt(this.dot(this));
  }
  norm() {
    let len2 = this.dot(this);

    if (len2 == 1 || len2 == 0) return this;
    else return this.divNum(Math.sqrt(len2)); 
  }
}

let Time = new time();

function D2R(A) {
  return A * (Math.PI / 180.0);
}

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

const clients = [];
const players = [];

class player {
  constructor(socket) {
    this.socket = socket;
    // ship pos
    this.pos = {
      X: (Math.random() * 2 - 1) * 200,
      Y: (Math.random() * 2 - 1) * 200,
      Angle: 90,
    };
    // ship acceleration
    this.accel = {
      Angle: this.pos.Angle, // RELATIVE TO SHIP
      value: 0,
    };
    // ship speed
    this.speed = {
      X: 0,
      Y: 0,
      Max: 10,
    };
    this.socket.on("inputResponse", (res) => {
      let input = JSON.parse(res);
      // manage acceleration
      let speedV2 = new vec2(this.speed.X, this.speed.Y);
      let accelV2 = new vec2(this.accel.value * Math.cos(D2R(this.accel.Angle)), this.accel.value * Math.sin(D2R(this.accel.Angle)));
      let speedDotAccel = speedV2.norm().dot(accelV2.norm());
      if (input.W || input.Q || input.E) this.accel.value = 10;
      else if (speedDotAccel > -0.6 && speedV2.len() > 0.1)
      {
        console.log(`${this.socket.id} is trying to slow down`);
        this.accel.value = -10;
      }
      else (this.accel.value = 0);
      // manage acceleration angle
      this.accel.Angle = (input.Q - input.E) / (input.W ? 2 : 1);
      // manage ship angle
      let deltaAngle = (input.A - input.D) * 120 * Time.localDelta;
      this.pos.Angle += deltaAngle;
      if (this.pos.Angle > 180) this.pos.Angle -= 360;
      if (this.pos.Angle < -180) this.pos.Angle += 360;
    });
  }
  move() {
    this.pos.X += this.speed.X;
    this.pos.Y += this.speed.Y;

    let angle = this.pos.Angle + this.accel.Angle;
    this.speed.X += Math.cos(D2R(angle)) * this.accel.value * Time.localDelta;
    this.speed.Y += Math.sin(D2R(angle)) * this.accel.value * Time.localDelta;

    if (
      this.speed.X * this.speed.X + this.speed.Y * this.speed.Y >
      this.speed.Max * this.speed.Max
    ) {
      let len = Math.sqrt(
        this.speed.X * this.speed.X + this.speed.Y * this.speed.Y
      );
      this.speed.X = (this.speed.X / len) * this.speed.Max;
      this.speed.Y = (this.speed.Y / len) * this.speed.Max;
    }
  }
}

// game tick
setInterval(() => {
  Time.response();
  for (let cl of players) {
    cl.move();
    cl.socket.emit(
      "sendInfo",
      JSON.stringify(cl.pos),
      JSON.stringify(cl.speed),
      JSON.stringify(cl.accel)
    );
    for (let pl of players)
      if (
        Math.abs(pl.pos.X - cl.pos.X) < 600 &&
        Math.abs(pl.pos.Y - cl.pos.Y) < 400
      )
        cl.socket.emit("drawPlayer", JSON.stringify(pl.pos));
    cl.socket.emit("inputRequest");
  }
}, 10);

io.on("connection", (socket) => {
  clients.push(socket);
  players.push(new player(socket));
  console.log(`A client connected with id ${socket.id}`);
  socket.on("disconnect", () => {
    console.log(`Client with id ${socket.id} has disconnected`);
    let index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
      players.splice(index, 1);
      console.log(`${socket.id} removed from client list`);
      console.log(`${socket.id} removed from player list`);
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on localhost:${server.address().port}`);
});
