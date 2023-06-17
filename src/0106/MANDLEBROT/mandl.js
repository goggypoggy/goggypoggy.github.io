let canvas;
let gl;
let program;

function loadShader(type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    console.log("compiling error");

  return shader;
}

async function fetchShader(shaderURL) {
  try {
    const response = await fetch(shaderURL);
    const text = response.text();

    return text;
  } catch (err) {
    alert(err);
  }
}

export function initGL() {
  canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vs = fetchShader("./vert.glsl");
  const fs = fetchShader("./frag.glsl");

  Promise.all([vs, fs])
    .then((res) => {
      let vstext = res[0];
      let fstext = res[1];

      const vertexSh = loadShader(gl.VERTEX_SHADER, vstext);
      const fragmentSh = loadShader(gl.FRAGMENT_SHADER, fstext);

      program = gl.createProgram();
      gl.attachShader(program, vertexSh);
      gl.attachShader(program, fragmentSh);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("!!!!!");
        return;
      }

      const StartTime = Date.now();

      let mousewheel = 1;
      let mousex = 0;
      let mousey = 0;

      window.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) mousewheel /= 2;
        else mousewheel *= 2;
        mousewheel = mousewheel < 1 ? 1 : mousewheel;
      });

      const timer = () => {
        window.addEventListener("mousemove", (event) => {
          mousex = event.clientX - 10;
          mousey = event.clientY - 10;
          mousex =
            mousex < 0
              ? 0
              : mousex > gl.canvas.width
              ? gl.canvas.width
              : mousex;
          mousey =
            mousey < 0
              ? 0
              : mousey > gl.canvas.height
              ? gl.canvas.height
              : mousey;
        });

        const posLoc = gl.getAttribLocation(program, "in_pos");
        const timeLoc = gl.getUniformLocation(program, "Time");
        const mxLoc = gl.getUniformLocation(program, "MouseX");
        const myLoc = gl.getUniformLocation(program, "MouseY");
        const mwLoc = gl.getUniformLocation(program, "MouseWheel");
        const cwLoc = gl.getUniformLocation(program, "Width");
        const chLoc = gl.getUniformLocation(program, "Height");
        const posBuf = gl.createBuffer();
        const pos = [-1, -1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1];
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
        gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(posLoc);
        gl.useProgram(program);
        gl.uniform1f(timeLoc, (Date.now() - StartTime) / 1000.0);
        gl.uniform1f(mxLoc, mousex);
        gl.uniform1f(myLoc, mousey);
        gl.uniform1f(mwLoc, mousewheel);
        gl.uniform1f(cwLoc, gl.canvas.width);
        gl.uniform1f(chLoc, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        window.requestAnimationFrame(timer);
      };

      timer();
    })
    .catch((err) => alert("ERROR!: " + err));
}
