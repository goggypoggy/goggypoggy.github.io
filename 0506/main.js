let shaderProgram, Pr, gl, UBuf, angle = 0;

let matrVP,
  projDist = 1,
  projSize = 1,
  projFarClip = 3000000;

class prim {
  constructor(posBuf, I) {
    this.VBuf = gl.createBuffer();
    this.IBuf = gl.createBuffer();
    this.VA = gl.createVertexArray();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * posBuf.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(posBuf), 0);

    gl.bindVertexArray(this.VA);
    let posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 3 * 4, 0);
    gl.enableVertexAttribArray(posLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 4 * I.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint32Array(I), 0);

    this.NumOfElem = I.length;

    return this;
  }
}

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
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
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
  return new Promise((resolve, reject) => {
    let canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    let vs, fs;
    const f1 = fetch("./shd/vert.glsl")
      .then((res) => res.text())
      .then((data) => {
        vs = data;
      });
    const f2 = fetch("./shd/frag.glsl")
      .then((res) => res.text())
      .then((data) => {
        fs = data;
      });

    Promise.all([f1, f2]).then((res) => {
      const vsh = loadShader(gl.VERTEX_SHADER, vs);
      const fsh = loadShader(gl.FRAGMENT_SHADER, fs);

      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vsh);
      gl.attachShader(shaderProgram, fsh);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const Buf = gl.getProgramInfoLog(shaderProgram);
        console.log(Buf);
        reject("Compiling error");
      }

      let pos = [
        1, 1, 0,
        -1, 1, 0,
        -1, -1, 0,
        1, -1, 0,
        0, 0, 1,
      ];
      let I = [
        0, 1, 2,
        2, 3, 0,
        0, 3, 4,
      ];

      Pr = new prim(pos, I);

      UBuf = gl.createBuffer();
      gl.bindBuffer(gl.UNIFORM_BUFFER, UBuf);
      gl.bufferData(gl.UNIFORM_BUFFER, 4 * 4 * 4, gl.STATIC_DRAW);

      resolve();
    });
  });
}

function render() {
  gl.clearColor(0.2, 0.47, 0.3, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);

  let 
    rx = projSize,
    ry = projSize;

  if (gl.canvas.width > gl.canvas.height)
    rx *= gl.canvas.width / gl.canvas.height;
  else ry *= gl.canvas.height / gl.canvas.width;

  let matrV = new mat4();
  let matrP = new mat4();
  matrV = matrV.matrView(new vec3(0, 0, 10), new vec3(0, 0, 0), new vec3(0, 1, 0));
  matrP = matrP.matrFrustrum(-rx / 2, rx / 2, -ry / 2, ry / 2, projDist, projFarClip);
  let matrVP = matrV.mulMatr(matrP);

  let posWVP = gl.getUniformLocation(shaderProgram, "MatrWVP");

  angle = angle == 360 ? 0 : angle + 1;

  let matrW = new mat4();
  matrW = matrW.matrRotateX(angle).mulMatr(matrW.matrRotateZ(angle));
  let matrWVP = matrW.mulMatr(matrVP);

  gl.useProgram(shaderProgram);

  //mat4Out(matrVP);
  gl.bindBuffer(gl.UNIFORM_BUFFER, UBuf);
  //console.log(matrWVP.toArray());
  gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(matrWVP.toArray()), gl.STATIC_DRAW);

  let bufPos = gl.getUniformBlockIndex(shaderProgram, "UBuf");
  gl.uniformBlockBinding(shaderProgram, bufPos, 0);
  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, UBuf);

  gl.bindVertexArray(Pr.VA);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, Pr.IBuf);
  gl.drawElements(gl.TRIANGLE_STRIP, Pr.NumOfElem, gl.UNSIGNED_INT, Pr.IBuf);
  window.requestAnimationFrame(render);
}

function main() {
  const init = GLInit();
  init
    .then((res) => {
      render();
    })
    .catch((err) => {
      console.log(err);
    });
}
