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
  switch (event.key) {
    case " ":
      input.Space = true;
      break;
    case "q":
      input.Q = true;
      break;
    case "w":
      input.W = true;
      break;
    case "e":
      input.E = true;
      break;
    case "a":
      input.A = true;
      break;
    case "s":
      input.S = true;
      break;
    case "d":
      input.D = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case " ":
      input.Space = false;
      break;
    case "q":
      input.Q = false;
      break;
    case "w":
      input.W = false;
      break;
    case "e":
      input.E = false;
      break;
    case "a":
      input.A = false;
      break;
    case "s":
      input.S = false;
      break;
    case "d":
      input.D = false;
      break;
  }
});

let infoPos = {
  X: 0,
  Y: 0,
  Angle: 90,
};
let infoSpeed = {
  X: 0,
  Y: 0,
  Max: 100,
};
let infoAccel = {
  Angle: 90,
  value: 0,
};

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
    cnv.lineWidth = 4;
    cnv.strokeStyle = this.color;
    cnv.beginPath();
    cnv.moveTo(
      this.posX + 40 * Math.cos(D2R(this.angle)),
      this.posY + 40 * -Math.sin(D2R(this.angle))
    );
    cnv.lineTo(
      this.posX + 40 * Math.cos(D2R(this.angle + 150)),
      this.posY + 40 * -Math.sin(D2R(this.angle + 150))
    );
    cnv.lineTo(
      this.posX + 40 * Math.cos(D2R(this.angle - 150)),
      this.posY + 40 * -Math.sin(D2R(this.angle - 150))
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
    cnv.fillStyle = "#DDDDFF";
    cnv.fillText(`Pos: [${infoPos.X}|${infoPos.Y}]`, this.posX, this.posY + 20);
    cnv.fillText(`Angle: ${infoPos.Angle}`, this.posX, this.posY + 50);
    cnv.fillText(`Speed: [${infoSpeed.X}|${infoSpeed.Y}]`, this.posX, this.posY + 80);
    cnv.fillText(`Speed|Max speed: ${Math.sqrt(infoSpeed.X * infoSpeed.X + infoSpeed.Y * infoSpeed.Y)}|${infoSpeed.Max}`, this.posX, this.posY + 110);
    cnv.fillText(`Accel: [${infoAccel.Angle}|${infoAccel.value}]`, this.posX, this.posY + 140);
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
    setInterval(() => {
      itemQueue.push(new itemInfo(10, 10));
      drawQueue();
    }, 15);
  });

  socket.on("sendInfo", (pos, speed, accel) => {
    let Pos = JSON.parse(pos);
    let Speed = JSON.parse(speed);
    let Accel = JSON.parse(accel);
    infoPos = Pos;
    infoSpeed = Speed;
    infoAccel = Accel;
  });

  socket.on("drawPlayer", (pos) => {
    let Pos = JSON.parse(pos);
    itemQueue.push(
      new itemPlayer(
        Pos.X - infoPos.X + cnv.canvas.width / 2,
        infoPos.Y - Pos.Y + cnv.canvas.height / 2,
        Pos.Angle,
        "#000000"
      )
    );
  });

  socket.on("inputRequest", ()=>{
    let inpStr = JSON.stringify(input);
    socket.emit("inputResponse", inpStr);
  });
}

window.addEventListener("load", (event) => {
  main();
});
