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

async function fetchSource(shaderURL) {
  try {
    const response = await fetch(shaderURL);
    const text = response.text();

    return text;
  } catch (err) {
    alert(`Couldn't fetch source from ${shaderURL}`);
  }
}

function shaderInit() {
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
        reject();
      }
      resolve();
    });
  });
}
