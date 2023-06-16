async function GLInit() {
  return new Promise((resolve, reject) => {
    let canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    const shdInit = shaderInit();

    shaderInit()
      .then((res) => {
        Scene.push(new cube(1, new vec3(2, 0, 0)));
        Scene.push(new cube(1, new vec3(-2, 0, 0)));

        MatrBuf = gl.createBuffer();

        matrW = new mat4();

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

  let rx = projSize,
    ry = projSize;

  if (gl.canvas.width > gl.canvas.height)
    rx *= gl.canvas.width / gl.canvas.height;
  else ry *= gl.canvas.height / gl.canvas.width;

  let matrV = new mat4();
  let matrP = new mat4();
  matrV = matrV.matrView(
    new vec3(0, 0, 10),
    new vec3(0, 0, 0),
    new vec3(0, 1, 0)
  );
  matrP = matrP.matrFrustrum(
    -rx / 2,
    rx / 2,
    -ry / 2,
    ry / 2,
    projDist,
    projFarClip
  );
  matrVP = matrV.mulMatr(matrP);

  for (let elem of Scene) if (elem.response != undefined) elem.response();

  for (let elem of Scene) if (elem.draw != undefined) elem.draw();

  window.requestAnimationFrame(cycle);
}

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
