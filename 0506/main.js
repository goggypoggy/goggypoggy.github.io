let wasInput = false;

async function GLInit() {
  return new Promise((resolve, reject) => {
    let canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl2");

    const shdInit = shaderInit();

    shaderInit()
      .then((res) => {
        Scene.push(new cube(2, new vec3(2, 0, 1)));
        Scene.push(new tetra(1, new vec3(-2, 0, 1)));
        Scene.push(new octa(2, new vec3(0, 0, 1)));
        Scene.push(new cube(2, new vec3(2, 0, -1), false));
        Scene.push(new tetra(1, new vec3(-2, 0, -1), false));
        Scene.push(new octa(2, new vec3(0, 0, -1), false));

        MatrBuf = gl.createBuffer();

        matrW = new mat4();

        camera = new cam(
          new vec3(0, 0, 10),
          new vec3(0, 0, 0),
          new vec3(0, 1, 0)
        );

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

  if (wasInput)
    wasInput = false;
  else
    mdx = 0, mdy = 0, mdz = 0;

  Time.response();
  camera.move();

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

function eHndlr(event) {
  switch (event.type) {
    case "mouseup":
      event.preventDefault();
      if (event.button == 0) mL = 0;
      else mR = 0;
      break;
    case "mousedown":
      event.preventDefault();
      if (event.button == 0) mL = 1;
      else mR = 1;
      break;
    case "wheel":
      event.preventDefault();
      mdz = event.deltaY / 10;
      break;
    default:
      mdx = mx - event.clientX;
      mdy = my - event.clientY;
      mx = event.clientX;
      my = event.clientY;
      break;
  }
  // console.log([mx, my, mdx, mdy].join(" : "));
  mdx *= -1;
  mdy *= -1;
  wasInput = true;
}
