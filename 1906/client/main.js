import { io } from "socket.io-client";

let inMM = false;

async function main() {
  const socket = io();

  // client-side
  socket.on("connect", () => {
    console.log(`Connected to server with id ${socket.id}`);
  });

  document
    .getElementById("matchmakeButton")
    .addEventListener("mousedown", () => {
      if (!inMM) socket.emit("matchmakeRequest");
      else socket.emit("leaveMMrequest");
    });

  socket.on("joinedMM", () => {
    document.getElementById("matchmakePrompt").innerHTML =
      "You have joined the matchmaking queue";
    document.getElementById("matchmakeButton").value =
      "Leave queue"; 
    inMM = true;
  });
  socket.on("alreadyInMM", () => {
    document.getElementById("matchmakePrompt").innerHTML =
      "You are already in matchmaking!";
  });
  socket.on("leftMM", ()=>{
    document.getElementById("matchmakePrompt").innerHTML =
      "You have left the matchmaking queue";
    document.getElementById("matchmakeButton").value =
      "Join queue"; 
    inMM = false;
  });

  socket.on("updateMMplayerCounter", (count) => {
    document.getElementById(
      "matchmakePlayerCount"
    ).innerHTML = `There are currently ${count} players in matchmaking queue`;
  });
  /*
  socket.on("disconnect", () => {
    console.log(`${socket.id} (you) has disconnected`);
  });
  */
}

window.addEventListener("load", (event) => {
  main();
});
