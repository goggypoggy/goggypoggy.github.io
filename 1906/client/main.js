import { io } from "socket.io-client";

let inMM = false,
  inGame = false,
  deploying = false,
  attacking = false;

let myboard = document.getElementById("myBoardTable");
let enemyboard = document.getElementById("enemyBoardTable");

let myboarddata = myboard.querySelectorAll("td");
let enemyboarddata = enemyboard.querySelectorAll("td");

window.addEventListener("mousedown", () => {
  mpress = true;
});

let board1, board2;

function boardsColorsSet() {
  let i, j;

  for (i = 0; i < 11; i++)
    for (j = 0; j < 11; j++) {
      if (i == 0 || j == 0)
        myboarddata[i * 11 + j].style.backgroundColor = "rgb(60, 100, 100)";
      else {
        if (inGame && board1 != undefined) {
          switch (board1[(i - 1) * 10 + (j - 1)]) {
            case "0":
              myboarddata[i * 11 + j].style.backgroundColor = "blue";
              myboarddata[i * 11 + j].style.innerText = "";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "2":
              myboarddata[i * 11 + j].style.backgroundColor = "black";
              myboarddata[i * 11 + j].style.innerText = "";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "3":
              myboarddata[i * 11 + j].style.backgroundColor = "black";
              myboarddata[i * 11 + j].style.innerText = "X";
              myboarddata[i * 11 + j].style.color = "white";
              break;
            case "4":
              myboarddata[i * 11 + j].style.backgroundColor = "blue";
              myboarddata[i * 11 + j].style.innerText = "X";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "5":
              myboarddata[i * 11 + j].style.backgroundColor = "white";
              myboarddata[i * 11 + j].style.innerText = "X";
              myboarddata[i * 11 + j].style.color = "black";
              break;
          }
          if (deploying)
            if (j == x + 1 && i == y + 1) {
              myboarddata[i * 11 + j].innerText = "X";
              myboarddata[i * 11 + j].color = "black";
            }
        } else {
          myboarddata[i * 11 + j].style.backgroundColor = "aliceblue";
          myboarddata[i * 11 + j].style.color = "black";
        }
      }
    }

  for (i = 0; i < 11; i++)
    for (j = 0; j < 11; j++) {
      if (i == 0 || j == 0)
        enemyboarddata[i * 11 + j].style.backgroundColor = "rgb(60, 100, 100)";
      else {
        if (inGame && board2 != undefined) {
          switch (board2[(i - 1) * 10 + (j - 1)]) {
            case "0":
              enemyboarddata[i * 11 + j].style.backgroundColor = "blue";
              enemyboarddata[i * 11 + j].innerText = "";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "1":
              enemyboarddata[i * 11 + j].style.backgroundColor = "grey";
              enemyboarddata[i * 11 + j].innerText = "";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "2":
              enemyboarddata[i * 11 + j].style.backgroundColor = "black";
              enemyboarddata[i * 11 + j].innerText = "";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "3":
              enemyboarddata[i * 11 + j].style.backgroundColor = "black";
              enemyboarddata[i * 11 + j].style.innerText = "X";
              enemyboarddata[i * 11 + j].style.color = "white";
              break;
            case "4":
              enemyboarddata[i * 11 + j].style.backgroundColor = "blue";
              enemyboarddata[i * 11 + j].style.innerText = "X";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "5":
              enemyboarddata[i * 11 + j].style.backgroundColor = "white";
              enemyboarddata[i * 11 + j].style.innerText = "X";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
          }
          if (attacking)
            if (j == xe + 1 && i == ye + 1) {
              enemyboarddata[i * 11 + j].innerText = "X";
              enemyboarddata[i * 11 + j].style.color = "red";
            }
        } else {
          enemyboarddata[i * 11 + j].style.backgroundColor = "aliceblue";
          enemyboarddata[i * 11 + j].style.color = "black";
        }
      }
    }
}

let x = -1,
  y = -1;
let xe = -1,
  ye = -1;

let mpress = false;

myboard.addEventListener("mousemove", (event) => {
  let x0 = myboard.offsetLeft;
  x = Math.floor(((event.pageX - x0) / myboard.clientWidth) * 11) - 1;
  let y0 = myboard.offsetTop;
  y = Math.floor(((event.pageY - y0) / myboard.clientHeight) * 11) - 1;

  boardsColorsSet();
  event.preventDefault();
});

enemyboard.addEventListener("mousemove", (event) => {
  let x0 = enemyboard.offsetLeft;
  xe = Math.floor(((event.pageX - x0) / enemyboard.clientWidth) * 11) - 1;
  let y0 = enemyboard.offsetTop;
  ye = Math.floor(((event.pageY - y0) / enemyboard.clientHeight) * 11) - 1;

  boardsColorsSet();
  event.preventDefault();
});

async function main() {
  let socket = io();

  boardsColorsSet();
  // connected to server
  socket.on("connect", () => {
    console.log(`Connected to server with id ${socket.id}`);
    document.getElementById("myBoardName").innerHTML = `${socket.id} (You)`;
  });

  // button press
  document.getElementById("theButton").addEventListener("mousedown", () => {
    if (!inGame) {
      if (!inMM) socket.emit("matchmakeRequest");
      else socket.emit("leaveMMrequest");
    } else socket.emit("concedeRequest");
  });

  // matchmaking request confirms
  socket.on("joinedMM", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML =
      "You have joined the matchmaking queue";
    document.getElementById("theButton").value = "Leave queue";
    inMM = true;
  });
  socket.on("alreadyInMM", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML =
      "You are already in matchmaking!";
  });
  socket.on("leftMM", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML =
      "You have left the matchmaking queue";
    document.getElementById("theButton").value = "Join queue";
    inMM = false;
  });

  // players in MM counter update
  socket.on("updateMMplayerCounter", (count) => {
    if (!inGame)
      document.getElementById(
        "matchmakePlayerCount"
      ).innerHTML = `There are currently ${count} players in matchmaking queue`;
    else document.getElementById("matchmakePlayerCount").innerHTML = "";
  });

  // game
  socket.on("gameStart", (enemyID) => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = "You joined the game!";
    document.getElementById("enemyBoardName").innerHTML = `${enemyID} (Enemy)`;
    document.getElementById("theButton").value = "Concede";
    (inMM = false), (inGame = true), (mpress = false);
    socket.emit("gameDeploy", -1, -1);
  });
  socket.on("gameEnd", (status) => {
    document.getElementById("gamePrompt").innerHTML =
      status == "win"
        ? "You win!"
        : status == "lose"
        ? "You lost!"
        : "Both players didn't prepare their boards in time! You both suck!";
    document.getElementById("enemyBoardName").innerHTML =
      "No one's here... yet... (Enemy)";
    document.getElementById("theButton").value = "Join queue";
    inGame = false;
    //boardsColorsSet();
  });
  socket.on("concedeSuccess", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById(
      "thePrompt"
    ).innerHTML = `You have conceded and left the game`;
  });
  socket.on("opponentConcede", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = `${
      document.getElementById("enemyBoardName").innerHTML
    } admits their weakness and concedes!`;
  });
  socket.on("opponentLeft", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = `${
      document.getElementById("enemyBoardName").innerHTML
    } left the game`;
  });
  socket.on("gameUpdate", (num, phase, boardMine, boardOpp) => {
    switch (phase) {
      case "Setup":
        document.getElementById(
          "gamePrompt"
        ).innerHTML = `Setup phase! Deploy your ships! ${num} seconds left!`;
        deploying = true;
        attacking = false;
        if (mpress) socket.emit("gameDeploy", x, y);
        break;
      case "Battle":
        document.getElementById("gamePrompt").innerHTML =
          "Battle phase! Attack the enemy! ";
        document.getElementById("gamePrompt").innerHTML +=
          num == 1 ? "Your turn!" : "The enemie's turn!";
        deploying = false;
        attacking = num == 1 ? true : false;
        if (mpress) socket.emit("gameAttack", xe, ye);
        break;
    }
    board1 = boardMine;
    board2 = boardOpp;
    boardsColorsSet();
    mpress = false;
  });
  socket.on("boardVerification", (status) => {
    switch (status) {
      case "allGood":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById("thePrompt").innerHTML =
          "Board verified! You're all set!";
        break;
      case "cornersWrong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "Ships can't be touching corners with each other!";
        break;
      case "shipTooLong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "You can't have ships longer than 4 cells!";
        break;
      case "4cellWrong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "You should have ONE 4-long ship!";
        break;
      case "3cellWrong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "You should have TWO 3-long ships!";
        break;
      case "2cellWrong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "You should have THREE 2-long ships!";
        break;
      case "1cellWrong":
        document.getElementById("thePrompt").style.color = "red";
        document.getElementById("thePrompt").innerHTML =
          "You should have FOUR 1-long ships!";
        break;
    }
  });
  socket.on("shotFeedback", (id, shotStatus) => {
    switch (shotStatus) {
      case "miss":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById("thePrompt").innerHTML = `${id} missed!`;
        break;
      case "hit":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById(
          "thePrompt"
        ).innerHTML = `${id} hit! ${id} can attack again!`;
        break;
      case "shotThereAlready":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById(
          "thePrompt"
        ).innerHTML = `${id} shot a cell that was already shot and can attack again.`;
        break;
    }
  });
}

window.addEventListener("load", (event) => {
  main();
});
