let canvas = document.getElementById("glCanvas"),
  gl,
  program;
let mw = 1,
  mx = 0,
  my = 0,
  mdx = 0,
  mdy = 0,
  mpress = false,
  wasInput = false,
  wasScroll = false;

function eventHandler(event) {
  switch (event.type) {
    case "wheel":
      event.preventDefault();
      if (event.deltaY > 0) mw /= 1.25;
      else mw *= 1.25;
      wasScroll = true;
      break;
    case "mousemove":
      mdx = mx - event.clientX;
      mdy = my - event.clientY;
      mx = event.clientX;
      my = event.clientY;
      break;
    case "mousedown":
      mpress = true;
      break;
    case "mouseup":
      mpress = false;
      break;
  }
  wasInput = true;
}

canvas.addEventListener("wheel", eventHandler);
window.addEventListener("mousemove", eventHandler);
canvas.addEventListener("mousedown", eventHandler);
window.addEventListener("mouseup", eventHandler);

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

async function fetchShader(shaderURL) {
  try {
    const response = await fetch(shaderURL);
    const text = response.text();

    return text;
  } catch (err) {
    alert(err);
  }
}

async function shaderInit() {
  return new Promise((resolve, reject) => {
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
          const Buf = gl.getProgramInfoLog(shaderProgram);
          reject(Buf);
        }
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function main() {
  gl = canvas.getContext("webgl2");

  gl.clearColor(1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  shaderInit()
    .then((res) => {
      const StartTime = Date.now();
      let x0 = -2,
        x1 = 2,
        y0 = -2,
        y1 = 2;

      const posLoc = gl.getAttribLocation(program, "in_pos");
      const timeLoc = gl.getUniformLocation(program, "Time");
      const x0Loc = gl.getUniformLocation(program, "X0");
      const x1Loc = gl.getUniformLocation(program, "X1");
      const y0Loc = gl.getUniformLocation(program, "Y0");
      const y1Loc = gl.getUniformLocation(program, "Y1");
      const cwLoc = gl.getUniformLocation(program, "Width");
      const chLoc = gl.getUniformLocation(program, "Height");

      const posBuf = gl.createBuffer();
      const pos = [-1, -1, 0, 1, -1, 1, 0, 1, 1, -1, 0, 1, 1, 1, 0, 1];
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      gl.vertexAttribPointer(posLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(posLoc);

      const timer = () => {
        if (mpress == true) {
          let oldx0 = x0,
            oldx1 = x1,
            oldy0 = y0,
            oldy1 = y1;

          x0 += ((oldx1 - oldx0) * mdx) / gl.canvas.width;
          x1 += ((oldx1 - oldx0) * mdx) / gl.canvas.width;
          y0 += ((oldy1 - oldy0) * mdy) / gl.canvas.width;
          y1 += ((oldy1 - oldy0) * mdy) / gl.canvas.width;
        }

        let cx = (x1 - x0) / 2 + x0;
        let cy = (y1 - y0) / 2 + y0;

        x0 = cx - 2 / mw;
        x1 = cx + 2 / mw;
        y0 = cy - 2 / mw;
        y1 = cy + 2 / mw;

        if (wasInput) wasInput = false;
        else (mdx = 0), (mdy = 0);

        gl.useProgram(program);
        gl.uniform1f(timeLoc, (Date.now() - StartTime) / 1000.0);
        gl.uniform1f(x0Loc, x0);
        gl.uniform1f(x1Loc, x1);
        gl.uniform1f(y0Loc, y0);
        gl.uniform1f(y1Loc, y1);
        gl.uniform1f(cwLoc, gl.canvas.width);
        gl.uniform1f(chLoc, gl.canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        window.requestAnimationFrame(timer);
      };

      timer();
    })
    .catch((err) => console.error(err));
}
