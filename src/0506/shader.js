import vert from "./shd/vert.glsl";
import frag from "./shd/frag.glsl";
export let gl, shaderProgram;

let canvas = document.getElementById("glCanvas");
gl = canvas.getContext("webgl2");

function loadShader(type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const buf = gl.getShaderInfoLog(shader);
    console.log("Compiling error:");
    console.log(buf);
  }

  return shader;
}

export function shaderInit() {
  return new Promise((resolve, reject) => {
    const vsh = loadShader(gl.VERTEX_SHADER, vert);
    const fsh = loadShader(gl.FRAGMENT_SHADER, frag);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vsh);
    gl.attachShader(shaderProgram, fsh);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      const Buf = gl.getProgramInfoLog(shaderProgram);
      reject(Buf);
    }
    resolve();
  });
}
