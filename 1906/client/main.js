import { io } from "socket.io-client";

let inMM = false,
  inGame = false,
  earlyReady = false,
  deploying = false,
  attacking = false;

let myboard = document.getElementById("myBoardTable");
let enemyboard = document.getElementById("enemyBoardTable");

let myboarddata = myboard.getElementsByTagName("td");
let enemyboarddata = enemyboard.getElementsByTagName("td");

myboard.addEventListener("mousedown", () => {
  if (deploying) mpress = true;
});

enemyboard.addEventListener("mousedown", () => {
  if (attacking) mpress = true;
});

let board1, board2;

function boardsColorsSet() {
  let i, j;

  let colorSea = "#3B9ECC",
    colorFire = "#CC8A3B",
    colorShip = "dimgray",
    colorFog = "#586971",
    colorUIbg = "#234654",
    colorUItext = "aliceblue";

  for (i = 0; i < 11; i++)
    for (j = 0; j < 11; j++) {
      if (i == 0 || j == 0) {
        myboarddata[i * 11 + j].style.backgroundColor = colorUIbg;
        if (inGame && deploying)
          myboarddata[i * 11 + j].style.color = colorUItext;
        else myboarddata[i * 11 + j].style.color = "black";
      } else {
        myboarddata[i * 11 + j].innerHTML = "X";
        if (board1 != undefined) {
          switch (board1[(i - 1) * 10 + (j - 1)]) {
            case "0":
              myboarddata[i * 11 + j].style.backgroundColor = colorSea;
              myboarddata[i * 11 + j].innerHTML = "&nbsp;";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "1":
              myboarddata[i * 11 + j].style.backgroundColor = colorFog;
              myboarddata[i * 11 + j].innerHTML = "&nbsp;";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "2":
              myboarddata[i * 11 + j].style.backgroundColor = colorShip;
              myboarddata[i * 11 + j].innerHTML = "&nbsp;";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "3":
              myboarddata[i * 11 + j].style.backgroundColor = colorShip;
              myboarddata[i * 11 + j].style.innerHTML = "X";
              myboarddata[i * 11 + j].style.color = colorFire;
              break;
            case "4":
              myboarddata[i * 11 + j].style.backgroundColor = colorSea;
              myboarddata[i * 11 + j].style.innerHTML = "X";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            case "5":
              myboarddata[i * 11 + j].style.backgroundColor = colorFire;
              myboarddata[i * 11 + j].style.innerHTML = "X";
              myboarddata[i * 11 + j].style.color = "black";
              break;
            default:
              console.log(`Could not draw ${board1[(i - 1) * 10 + (j - 1)]}`);
              break;
          }
          if (deploying)
            if (j == x + 1 && i == y + 1) {
              myboarddata[i * 11 + j].innerHTML = "X";
              myboarddata[i * 11 + j].style.color = colorShip;
            }
        } else {
          myboarddata[i * 11 + j].style.backgroundColor = "aliceblue";
          myboarddata[i * 11 + j].style.color = "black";
          myboarddata[i * 11 + j].innerHTML = "&nbsp;";
        }
      }
    }

  for (i = 0; i < 11; i++)
    for (j = 0; j < 11; j++) {
      if (i == 0 || j == 0) {
        enemyboarddata[i * 11 + j].style.backgroundColor = colorUIbg;
        if (inGame && attacking)
          enemyboarddata[i * 11 + j].style.color = colorUItext;
        else enemyboarddata[i * 11 + j].style.color = "black";
      } else {
        enemyboarddata[i * 11 + j].innerHTML = "X";
        if (board2 != undefined) {
          switch (board2[(i - 1) * 10 + (j - 1)]) {
            case "0":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorSea;
              enemyboarddata[i * 11 + j].innerHTML = "&nbsp;";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "1":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorFog;
              enemyboarddata[i * 11 + j].innerHTML = "&nbsp;";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "2":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorShip;
              enemyboarddata[i * 11 + j].innerHTML = "&nbsp;";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "3":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorShip;
              enemyboarddata[i * 11 + j].style.innerHTML = "X";
              enemyboarddata[i * 11 + j].style.color = colorFire;
              break;
            case "4":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorSea;
              enemyboarddata[i * 11 + j].style.innerHTML = "X";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            case "5":
              enemyboarddata[i * 11 + j].style.backgroundColor = colorFire;
              enemyboarddata[i * 11 + j].style.innerHTML = "X";
              enemyboarddata[i * 11 + j].style.color = "black";
              break;
            default:
              console.log(`Could not draw ${board2[(i - 1) * 10 + (j - 1)]}`);
              break;
          }
          if (attacking)
            if (j == xe + 1 && i == ye + 1) {
              enemyboarddata[i * 11 + j].innerHTML = "X";
              enemyboarddata[i * 11 + j].style.color = "red";
            }
        } else {
          enemyboarddata[i * 11 + j].style.backgroundColor = "aliceblue";
          enemyboarddata[i * 11 + j].style.color = "black";
          enemyboarddata[i * 11 + j].innerHTML = "&nbsp;";
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
    } else if (!earlyReady && deploying) socket.emit("earlyReady");
    else if (deploying) socket.emit("unearlyReady");
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
    if (!inGame) {
      document.getElementById("matchmakePlayerCount").style.color = "black";
      document.getElementById(
        "matchmakePlayerCount"
      ).innerHTML = `There are currently ${count} players in matchmaking queue`;
    }
  });

  // game
  socket.on("gameStart", (enemyID) => {
    document.getElementById("matchmakePlayerCount").style.color = "black";
    document.getElementById("matchmakePlayerCount").innerHTML = "";
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = "You joined the game!";
    document.getElementById("enemyBoardName").innerHTML = `${enemyID} (Enemy)`;
    document.getElementById("theButton").value = "I'm ready!";
    (inMM = false), (inGame = true), (mpress = false), (earlyReady = false);
    socket.emit("gameDeploy", -1, -1);
  });
  socket.on("earlyReadySuccess", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML =
      "Waiting for other player to prepare";
    document.getElementById("theButton").value = "I'm not ready";
    earlyReady = true;
  });
  socket.on("unearlyReadySuccess", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = "Prepare then!";
    document.getElementById("theButton").value = "I'm ready!";
    earlyReady = false;
  });
  socket.on("opponentEarlyReady", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = `${
      document.getElementById("enemyBoardName").innerHTML
    } is ready to play!`;
  });
  socket.on("opponentUnearlyReady", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = `${
      document.getElementById("enemyBoardName").innerHTML
    } is no longer ready to play.`;
  });
  socket.on("opponentLeft", () => {
    document.getElementById("thePrompt").style.color = "black";
    document.getElementById("thePrompt").innerHTML = `${
      document.getElementById("enemyBoardName").innerHTML
    } left the game`;
  });
  socket.on("gameUpdate", (arg, phase, boardMine, boardOpp) => {
    switch (phase) {
      case "Setup":
        document.getElementById(
          "gamePrompt"
        ).innerHTML = `Setup phase! Deploy your ships! ${arg} seconds left!`;
        deploying = true;
        attacking = false;
        boardsColorsSet();
        if (mpress) socket.emit("gameDeploy", x, y);
        break;
      case "Battle":
        document.getElementById("theButton").setAttribute("hidden", true);
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById("gamePrompt").innerHTML =
          arg == 1 ? "You attack!" : "The enemy attacks!";
        deploying = false;
        attacking = arg == 1 ? true : false;
        boardsColorsSet();
        if (mpress) socket.emit("gameAttack", xe, ye);
        break;
      case "End":
        document.getElementById("theButton").removeAttribute("hidden");
        document.getElementById("gamePrompt").innerHTML =
          arg == "win"
            ? "You win!"
            : arg == "lose"
            ? "You lost!"
            : "Both players didn't prepare their boards in time! You both suck!";
        document.getElementById("theButton").value = "Join queue";
        board1 = boardMine;
        board2 = boardOpp;
        boardsColorsSet();
        deploying = false;
        attacking = false;
        inGame = false;
        break;
    }
    board1 = boardMine;
    board2 = boardOpp;
    mpress = false;
  });
  socket.on("boardVerification", (status) => {
    switch (status) {
      case "allGood":
        document.getElementById("matchmakePlayerCount").style.color = "black";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "Board verified! You're all set!";
        break;
      case "cornersWrong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "Ships can't be touching corners with each other!";
        break;
      case "shipTooLong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "You can't have ships longer than 4 cells!";
        break;
      case "4cellWrong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "You should have ONE 4-long ship!";
        break;
      case "3cellWrong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "You should have TWO 3-long ships!";
        break;
      case "2cellWrong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "You should have THREE 2-long ships!";
        break;
      case "1cellWrong":
        document.getElementById("matchmakePlayerCount").style.color = "red";
        document.getElementById("matchmakePlayerCount").innerHTML =
          "You should have FOUR 1-long ships!";
        break;
    }
  });
  socket.on("shotFeedback", (id, shotStatus) => {
    switch (shotStatus) {
      case "miss":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById(
          "thePrompt"
        ).innerHTML = `Missed ${id}'s ships!`;
        break;
      case "hit":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById(
          "thePrompt"
        ).innerHTML = `Hit a ${id}'s ship! Attack again!`;
        break;
      case "shotThereAlready":
        document.getElementById("thePrompt").style.color = "black";
        document.getElementById(
          "thePrompt"
        ).innerHTML = `This spot on ${id}'s field was already shot. Try somewhere else.`;
        break;
    }
  });
}

window.addEventListener("load", (event) => {
  main();
});
