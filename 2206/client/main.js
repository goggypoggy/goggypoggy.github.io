import { io } from "socket.io-client";

let canvas = document.getElementById("Canvas2d");
let cnv = canvas.getContext("2d");

let itemQueue = [];

let input = {
  Q: false,
  W: false,
  E: false,
  A: false,
  S: false,
  D: false,
  Space: false,
};

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "Space":
      input.Space = true;
      break;
    case "KeyQ":
    case "Numpad7":
      input.Q = true;
      break;
    case "KeyW":
    case "Numpad8":
    case "ArrowUp":
      input.W = true;
      break;
    case "KeyE":
    case "Numpad9":
      input.E = true;
      break;
    case "KeyA":
    case "Numpad4":
    case "ArrowLeft":
      input.A = true;
      break;
    case "KeyS":
    case "Numpad5":
    case "Numpad2":
    case "ArrowDown":
      input.S = true;
      break;
    case "KeyD":
    case "Numpad6":
    case "ArrowRight":
      input.D = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "Space":
      input.Space = false;
      break;
    case "KeyQ":
    case "Numpad7":
      input.Q = false;
      break;
    case "KeyW":
    case "Numpad8":
    case "ArrowUp":
      input.W = false;
      break;
    case "KeyE":
    case "Numpad9":
      input.E = false;
      break;
    case "KeyA":
    case "Numpad4":
    case "ArrowLeft":
      input.A = false;
      break;
    case "KeyS":
    case "Numpad5":
    case "Numpad2":
    case "ArrowDown":
      input.S = false;
      break;
    case "KeyD":
    case "Numpad6":
    case "ArrowRight":
      input.D = false;
      break;
  }
});

let infoPos;
let infoSpeed;
let infoAccel;
let infoStats;

function D2R(A) {
  return A * (Math.PI / 180.0);
}

function getTime() {
  const date = new Date();
  return (
    date.getMilliseconds() / 1000.0 +
    date.getSeconds() +
    date.getMinutes() * 60.0
  );
}

class item {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }
  drawItem() {}
}

class itemPlayer extends item {
  constructor(posX, posY, angle, color) {
    super(posX, posY);
    this.angle = angle;
    this.color = color;
  }
  drawItem() {
    if (Math.abs(cnv.canvas.width / 2 - this.posX) <= (cnv.canvas.width + 100) / 2 && Math.abs(cnv.canvas.height / 2 - this.posY) <= (cnv.canvas.height + 100) / 2) {
    cnv.lineWidth = 4;
    cnv.strokeStyle = this.color;
    cnv.beginPath();
    cnv.moveTo(
      this.posX + 20 * Math.cos(D2R(this.angle)),
      this.posY + 20 * -Math.sin(D2R(this.angle))
    );
    cnv.lineTo(
      this.posX + 20 * Math.cos(D2R(this.angle + 140)),
      this.posY + 20 * -Math.sin(D2R(this.angle + 140))
    );
    cnv.lineTo(
      this.posX + 20 * Math.cos(D2R(this.angle - 140)),
      this.posY + 20 * -Math.sin(D2R(this.angle - 140))
    );
    cnv.closePath();
    cnv.stroke();
    }
  }
}

class itemBullet extends item {
  constructor(posX, posY, angle, color) {
    super(posX, posY);
    this.angle = angle;
    this.color = color;
  }
  drawItem() {
    cnv.lineWidth = 4;
    cnv.strokeStyle = this.color;
    cnv.beginPath();
    cnv.moveTo(
      this.posX + 10 * Math.cos(D2R(this.angle)),
      this.posY + 10 * -Math.sin(D2R(this.angle))
    );
    cnv.lineTo(
      this.posX + 10 * Math.cos(D2R(this.angle + 150)),
      this.posY + 10 * -Math.sin(D2R(this.angle + 150))
    );
    cnv.lineTo(
      this.posX + 10 * Math.cos(D2R(this.angle - 150)),
      this.posY + 10 * -Math.sin(D2R(this.angle - 150))
    );
    cnv.closePath();
    cnv.stroke();
  }
}

class itemInfo extends item {
  constructor(posX, posY) {
    super(posX, posY);
  }
  drawItem() {
    cnv.font = "20px sans-serif";
    cnv.fillStyle = "#AAAAFF";
    cnv.fillText(
      `Pos: [${Math.floor(infoPos.X)}|${Math.floor(infoPos.Y)}]`,
      this.posX,
      this.posY + 20
    );
    cnv.font = "30px sans-serif";
    cnv.fillStyle = "#FFAAAA";
    cnv.fillText(
      `HP: ${infoStats.hp.current.toFixed(2)} / ${infoStats.hp.max.toFixed(2)}`,
      this.posX,
      this.posY + 50
    );
  }
}

class itemDthMsg extends item {
  constructor(posX, posY) {
    super(posX, posY);
  }
  drawItem() {
    cnv.font = "40px sans-serif";
    cnv.fillStyle = "#FFAAAA";
    cnv.fillText(
      "Your ship was destroyed",
      this.posX,
      this.posY + 20
    );
    cnv.font = "20px sans-serif";
    cnv.fillStyle = "#AAAAAA";
    cnv.fillText(
      "Reload the page to respawn",
      this.posX,
      this.posY + 70
    );
  }
}

function drawQueue() {
  cnv.clearRect(0, 0, cnv.canvas.width, cnv.canvas.height);
  for (let elem of itemQueue) elem.drawItem();
  itemQueue.splice(0, itemQueue.length);
}

async function main() {
  let socket = io();

  // connected to server
  socket.on("connect", () => {
    console.log(`Connected to server with id ${socket.id}`);
  });

  socket.on("sendInfo", (pos, speed, accel, stats) => {
    let Pos = JSON.parse(pos);
    let Speed = JSON.parse(speed);
    let Accel = JSON.parse(accel);
    let Stats = JSON.parse(stats);
    infoPos = Pos;
    infoSpeed = Speed;
    infoAccel = Accel;
    infoStats = Stats;
    itemQueue.push(new itemInfo(10, 10));
  });

  socket.on("drawItem", (pos, type) => {
    let Pos = JSON.parse(pos);
    switch (type) {
      case "player":
        itemQueue.push(
          new itemPlayer(
            Pos.X - infoPos.X + cnv.canvas.width / 2,
            infoPos.Y - Pos.Y + cnv.canvas.height / 2,
            Pos.Angle,
            "#FFFFFF"
          )
        );
        break;
      case "bullet":
        itemQueue.push(
          new itemBullet(
            Pos.X - infoPos.X + cnv.canvas.width / 2,
            infoPos.Y - Pos.Y + cnv.canvas.height / 2,
            Pos.Angle,
            "#FF0000"
          )
        );
        break;
    }
  });

  socket.on("drawAll", () => {
    document.getElementById("Canvas2d").style.backgroundPositionX = `${
      -infoPos.X / 4
    }px`;
    document.getElementById("Canvas2d").style.backgroundPositionY = `${
      infoPos.Y / 4
    }px`;
    drawQueue();
  });

  socket.on("inputRequest", () => {
    let inpStr = JSON.stringify(input);
    socket.emit("inputResponse", inpStr);
  });

  socket.on("deathMessage", () => {
    document.getElementById("Canvas2d").style.backgroundImage = "none";
    itemQueue.splice(0, itemQueue.length);
    itemQueue.push(new itemDthMsg(10, 10));
    drawQueue();
  });

  socket.on("respawnComplete", ()=>{
    document.getElementById("Canvas2d").style.backgroundImage = "url(\"./Blue_Nebula_02-1024x1024.png\")";
  });
}

window.addEventListener("load", (event) => {
  main();
});
