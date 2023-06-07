import { vec3, mat4 } from "./mth.js";
export { main };

let shaderProgram;

function vec3Out(v) {
  console.log("===---");
  console.log([v.x, v.y, v.z].join(" "));
  console.log("===---");
}

function mat4Out(m) {
  console.log("___________________");
  console.log([m.a[0][0], m.a[0][1], m.a[0][2], m.a[0][3]].join(" "));
  console.log([m.a[1][0], m.a[1][1], m.a[1][2], m.a[1][3]].join(" "));
  console.log([m.a[2][0], m.a[2][1], m.a[2][2], m.a[2][3]].join(" "));
  console.log([m.a[3][0], m.a[3][1], m.a[3][2], m.a[3][3]].join(" "));
  console.log("-------------------");
}

function loadShader(type, source) {
  const shader = window.gl.createShader(type);

  window.gl.shaderSource(shader, source);
  window.gl.compileShader(shader);

  if (!window.gl.getShaderParameter(shader, window.gl.COMPILE_STATUS))
    console.log("Compiling error");

  return shader;
}

async function fetchSource(shaderURL) {
  try {
    const response = await fetch(shaderURL);
    const text = response.text();

    return text;
  } catch (err) {
    alert(`Couldn't fetch source from ${shaderURL}`);
  }
}

async function GLInit() {
  let canvas = document.getElementById("glCanvas");
  window.gl = canvas.getContext("webgl2");

  window.gl.clearColor(1, 0, 0, 1);
  window.gl.clear(gl.COLOR_BUFFER_BIT);

  let vs, fs;
  const f1 = fetch("/shd/vert.glsl")
    .then((res) => res.text())
    .then((data) => {
      vs = data;
    });
  const f2 = fetch("/shd/frag.glsl")
    .then((res) => res.text())
    .then((data) => {
      fs = data;
    });

  Promise.all([f1, f2]).then((res) => {
    const vsh = loadShader(window.gl.VERTEX_SHADER, vs);
    const fsh = loadShader(window.gl.FRAGMENT_SHADER, fs);

    shaderProgram = window.gl.createProgram();
    window.gl.attachShader(shaderProgram, vsh);
    window.gl.attachShader(shaderProgram, fsh);
    window.gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, window.gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(shaderProgram);
      console.log(Buf);
    }

    console.log(shaderProgram);
    
    
  });
}

function main() {
  GLInit();
}
