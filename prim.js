import { vec3 } from "./mth.js";

class vert {
  constructor(p, t, n, c) {
    this.p = p;
    this.t = t;
    this.n = n;
    this.c = n;
  }
}

class prim {
  constructor(V, I) {
    this.VA = gl.createVertexArray();
    gl.bindVertexArray(this.VA);

    this.VBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
    gl.bufferData(gl.ARRAY_BUFFER, V, gl.STATIC_DRAW);

    this.IBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENTS_ARRAY_BUFFER, this.IBuf);
    gl.bufferData(gl.ELEMENTS_ARRAY_BUFFER, I, gl.STATIC_DRAW);
  }

  draw() {}
}
