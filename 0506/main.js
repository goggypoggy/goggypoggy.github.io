let shaderProgram, Pr, gl;

let matrVP,
  projDist = 1,
  projSize = 1,
  projFarClip = 47000;

class vertex {
  constructor(P) {
    this.P = P;
    //this.N = N;

    return this;
  }
}

class prim {
  constructor(V, I) {
    this.V = V;
    this.I = I;

    return this;
  }
}

class buffer {
  constructor(type, size) {
    this.id = gl.createBuffer();
    this.type = type;
    gl.bindBuffer(this.type, this.id);
    gl.bufferData(type, size, gl.STATIC_DRAW);
  }
  update(data) {
    gl.bindBuffer(this.type, this.id);
    gl.bufferSubData(this.type, 0, new Float32Array(data), 0);
  }
  apply() {
    gl.bindBuffer(this.type, this.id);
  }
  release() {
    gl.deleteBuffer(this.id);
    this.id = null;
    this.size = 0;
  }
}

class vertex_buffer extends buffer {
  constructor(vertices) {
    super(gl.ARRAY_BUFFER, vertices.BYTES_PER_ELEMENT * vertices.length);
    this.numOfVertices = vertices.length;
  }

  update(data) {
    super.apply();
  }
  apply() {
    super.apply();
  }
  release() {
    super.release();
    this.numOfVertices = 0;
  }
}

class index_buffer extends buffer {
  constructor(indices) {
    super(gl.ELEMENT_ARRAY_BUFFER, 4 * indices.length);
    this.numOfIndices = vertices.length;
  }
  update(data) {
    super.update(data);
  }
  apply() {
    super.apply();
  }
  release() {
    super.release();
    this.numOfIndices = 0;
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

    gl.clearColor(0.2, 0.47, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

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

      let V = [
        new vertex(new vec3(1, 1, 0)),
        new vertex(new vec3(-1, 1, 0)),
        new vertex(new vec3(-1, -1, 0)),
        new vertex(new vec3(1, -1, 0)),
      ];
      let I = [0, 1, 2, 2, 3, 0];

      Pr = new prim(V, I);

      resolve();
    });
  });
}

function render() {
  let 
    rx = projSize,
    ry = projSize;

  if (gl.canvas.width > gl.canvas.height)
    rx *= gl.canvas.width / gl.canvas.height;
  else ry *= gl.canvas.height / gl.canvas.width;

  let matr = new mat4();
  matrVP = matr.matrView(new vec3(0, 0, 0), new vec3(0, 0, 1), new vec3(0, 1, 0));
  matrVP = matrVP.mulMatr(matr.matrFrustrum(-rx / 2, rx / 2, -ry / 2, ry / 2, projDist, projFarClip));

  let posBuf = [];

  for (let elem of Pr.V) {
    posBuf.push(elem.P.x);
    posBuf.push(elem.P.y);
    posBuf.push(elem.P.z);
    posBuf.push(1);
  }

  let ArrBuf = new vertex_buffer(posBuf);
  ArrBuf.update();
  ArrBuf.apply();

  let posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
  let posWVP = gl.getUniformLocation(shaderProgram, "MatrWVP");

  gl.vertexAttribPointer(
    posLoc,
    4,
    gl.FLOAT,
    false,
    posBuf.BYTES_PER_ELEMENT * 4,
    0
  );
  gl.enableVertexAttribArray(posLoc);

  let matrW = new mat4();
  let matrWVP = matrW.mulMatr(matrVP);

  gl.useProgram(shaderProgram);
  gl.uniformMatrix4fv(posWVP, false, new Float32Array(matrWVP.a[0][0]));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, posBuf.length);
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
