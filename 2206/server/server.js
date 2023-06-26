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
    (this.x = x), (this.y = y);
  }
  divNum(num) {
    return new vec2(this.x / num, this.y / num);
  }
  mulNum(num) {
    return new vec2(this.x * num, this.y * num);
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

function R2D(R) {
  return (R * 180) / Math.PI;
}

function Dto0360(D) {
  return D < 0 ? 360 + D : (D > 360 ? D - 360 : D);
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
const misc = [];

function destroyMisc(item) {
  let index = misc.indexOf(item);
  if (index > -1) {
    misc.splice(index, 1);
  }
}

class bullet {
  constructor(player) {
    this.owner = player.socket.id;
    this.type = "bullet";
    this.pos = {
      X: player.pos.X + 20 * Math.cos(D2R(player.pos.Angle)),
      Y: player.pos.Y + 20 * Math.sin(D2R(player.pos.Angle)),
      Angle: Dto0360(player.pos.Angle),
    };
    this.lifetime = {
      current: 0,
      max: player.stats.bullet.lifetime,
    };
    this.stats = {
      dmg: player.stats.bullet.dmg,
      homing: player.stats.bullet.homing,
    };
    this.speed = {
      Angle: player.pos.Angle,
      value:
        player.stats.bullet.speed +
        Math.sqrt(
          player.speed.X * player.speed.X + player.speed.Y * player.speed.Y
        ),
    };
  }
  move() {
    this.pos.X += this.speed.value * Math.cos(D2R(this.speed.Angle));
    this.pos.Y += this.speed.value * Math.sin(D2R(this.speed.Angle));

    let closest, closAngle = this.speed.Angle;

    for (let elem of players) {
      if (elem.socket.id == this.owner)
        continue;
      let dist = Math.sqrt(
        (this.pos.X - elem.pos.X) * (this.pos.X - elem.pos.X) +
          (this.pos.Y - elem.pos.Y) * (this.pos.Y - elem.pos.Y)
      );
      if (closest == undefined || closest > dist) {
        closest = dist;
        closAngle = R2D(Math.atan2(elem.pos.Y - this.pos.Y, elem.pos.X - this.pos.X));
      }
    }
    
    this.speed.Angle += (Dto0360(closAngle) - Dto0360(this.speed.Angle)) * (this.stats.homing / 5);
    this.pos.Angle = this.speed.Angle;

    // check colision with other players
    for (let pl of players) {
      if (pl.socket.id == this.owner) continue;
      if (
        (pl.pos.X - this.pos.X) * (pl.pos.X - this.pos.X) +
          (pl.pos.Y - this.pos.Y) * (pl.pos.Y - this.pos.Y) <=
        900
      ) {
        pl.shot(this.stats.dmg);
        destroyMisc(this);
      }
    }
    // kill the bullet if you have to
    this.lifetime.current += Time.localDelta;
    if (this.lifetime.current > this.lifetime.max) destroyMisc(this);
  }
}

class player {
  shoot() {
    if (this.stats.reload.current <= 0) {
      misc.push(new bullet(this));
      this.stats.reload.current = this.stats.reload.max;
    }
  }
  constructor(socket) {
    this.socket = socket;
    // ship stats
    this.stats = {
      hp: {
        current: 10,
        max: 10,
      },
      regen: {
        passive: 1,
        active: 0,
      },
      shield: "none",
      shieldHp: 0,
      shieldRegen: {
        passive: 0,
        active: 0,
      },
      maxSpeed: 10,
      acceleration: 15,
      reload: {
        current: 0,
        max: 0.25,
      },
      bullet: {
        dmg: 1,
        speed: 5,
        lifetime: 5,
        homing: 1,
      },
    };
    // ship pos
    this.pos = {
      X: (Math.random() * 2 - 1) * 2000,
      Y: (Math.random() * 2 - 1) * 2000,
      Angle: 90,
    };
    // ship acceleration
    this.accel = {
      Angle: this.pos.Angle, // RELATIVE TO SHIP
      value: 0,
    };
    this.deaccel = {
      Angle: 0, // RELATIVE TO SHIP
      value: 0,
    };
    // ship speed
    this.speed = {
      X: 0,
      Y: 0,
    };
    this.lastDmgTime = 0;

    this.socket.on("inputResponse", (res) => {
      let input = JSON.parse(res);
      // manage acceleration
      if (input.W || input.Q || input.E)
        (this.accel.value = this.stats.acceleration), (this.deaccel.value = 0);
      else if (
        this.speed.X * this.speed.X + this.speed.Y * this.speed.Y >
        0.0001
      ) {
        this.deaccel.value = this.stats.acceleration;
        this.accel.value = 0;
      } else (this.accel.value = 0), (this.deaccel.value = 0);
      // manage acceleration angle
      this.accel.Angle = ((input.Q - input.E) / (input.W ? 2 : 1)) * 90;
      this.deaccel.Angle =
        (Math.atan2(-this.speed.Y, -this.speed.X) * 180) / Math.PI;
      // manage ship angle
      let deltaAngle = (input.A - input.D) * 240 * Time.localDelta;
      this.pos.Angle += deltaAngle;
      if (this.pos.Angle > 180) this.pos.Angle -= 360;
      if (this.pos.Angle < -180) this.pos.Angle += 360;
      // shoot
      if (input.Space) this.shoot();
    });
  }
  move() {
    this.pos.X += this.speed.X;
    this.pos.Y += this.speed.Y;

    let angle = this.pos.Angle + this.accel.Angle;
    this.speed.X += Math.cos(D2R(angle)) * this.accel.value * Time.localDelta;
    this.speed.Y += Math.sin(D2R(angle)) * this.accel.value * Time.localDelta;

    angle = this.deaccel.Angle;
    this.speed.X += Math.cos(D2R(angle)) * this.deaccel.value * Time.localDelta;
    this.speed.Y += Math.sin(D2R(angle)) * this.deaccel.value * Time.localDelta;

    if (
      this.speed.X * this.speed.X + this.speed.Y * this.speed.Y >
      this.stats.maxSpeed * this.stats.maxSpeed
    ) {
      let len = Math.sqrt(
        this.speed.X * this.speed.X + this.speed.Y * this.speed.Y
      );
      this.speed.X = (this.speed.X / len) * this.stats.maxSpeed;
      this.speed.Y = (this.speed.Y / len) * this.stats.maxSpeed;
    }

    if (this.stats.reload.current > 0)
      this.stats.reload.current -= Time.localDelta;
    if (this.lastDmgTime > 0) this.lastDmgTime -= Time.localDelta;
    else if (this.stats.hp.current < this.stats.hp.max) {
      this.stats.hp.current += this.stats.regen.passive * Time.localDelta;
      if (this.stats.hp.current >= this.stats.hp.max)
        this.stats.hp.current = this.stats.hp.max;
    }
  }
  shot(dmg) {
    this.lastDmgTime = 5;
    this.stats.hp.current -= dmg;
    if (this.stats.hp.current <= 0) {
      this.socket.on("respawnRequest", () => {
        players.push(new player(this.socket));
        this.socket.emit("respawnComplete");
      });
      this.socket.emit("deathMessage");

      let index = players.indexOf(this);
      players.splice(index, 1);
    }
  }
}

// game tick
setInterval(() => {
  Time.response();
  for (let cl of players) {
    cl.socket.emit("drawAll");
    cl.socket.emit("inputRequest");
    cl.move();
    cl.socket.emit(
      "sendInfo",
      JSON.stringify(cl.pos),
      JSON.stringify(cl.speed),
      JSON.stringify(cl.accel),
      JSON.stringify(cl.stats)
    );
    for (let ms of misc) {
      if (
        Math.abs(ms.pos.X - cl.pos.X) < 1000 &&
        Math.abs(ms.pos.Y - cl.pos.Y) < 1000
      )
        switch (ms.type) {
          case "bullet":
            cl.socket.emit("drawItem", JSON.stringify(ms.pos), "bullet");
            break;
        }
      ms.move();
    }
    for (let pl of players)
      cl.socket.emit("drawItem", JSON.stringify(pl.pos), "player");
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
      console.log(`${socket.id} removed from client list`);
      for (let i = 0; i < players.length; i++)
        if (players[i] != undefined && players[i].socket.id == socket.id) {
          console.log(`${players[i].socket.id} removed from player list`);
          players.splice(i, 1);
        }
    }
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on localhost:${server.address().port}`);
});
