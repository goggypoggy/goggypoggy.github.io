import { Time } from "./timer.js";
import { input } from "./input.js";
import { gl, shaderInit } from "./shader.js";
import { vec3, camera }  from "./mth.js";
import { tetra } from "./tetra.js";
import { octa } from "./octa.js";
import { cube } from "./cube.js";
import { dodeca } from "./dodeca.js";
import { icoso } from "./icoso.js";

let Scene = [];

async function GLInit() {
  return new Promise((resolve, reject) => {
    const shdInit = shaderInit();

    shaderInit()
      .then((res) => {
        Scene.push(new tetra(1, new vec3(-3, 0, 1.5)));
        Scene.push(new octa(1, new vec3(0, 0, 1.5)));
        Scene.push(new cube(1, new vec3(3, 0, 1.5)));
        Scene.push(new dodeca(1, new vec3(6, 0, 1.5)));
        Scene.push(new icoso(1, new vec3(9, 0, 1.5)));

        Scene.push(new tetra(1, new vec3(-3, 0, -1.5), false));
        Scene.push(new octa(1, new vec3(0, 0, -1.5), false));
        Scene.push(new cube(1, new vec3(3, 0, -1.5), false));
        Scene.push(new dodeca(1, new vec3(6, 0, -1.5), false));
        Scene.push(new icoso(1, new vec3(9, 0, -1.5), false));

        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function cycle() {
  gl.clearColor(0.2, 0.47, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  input.update();
  Time.response();
  camera.move();

  for (let elem of Scene) if (elem.response != undefined) elem.response();

  for (let elem of Scene) if (elem.draw != undefined) elem.draw();

  window.requestAnimationFrame(cycle);
}

let glCanvas = document.getElementById("glCanvas");

window.addEventListener("mouseup", (event)=>{
  input.handleEvent(event);
});
glCanvas.addEventListener("mousedown", (event)=>{
  input.handleEvent(event);
});
window.addEventListener("mousemove", (event)=>{
  input.handleEvent(event);
});
glCanvas.addEventListener("wheel", (event)=>{
  input.handleEvent(event);
});

function main() {
  const init = GLInit();
  init
    .then((res) => {
      cycle();
    })
    .catch((err) => {
      console.log(err);
    });
}

window.addEventListener("load", main);