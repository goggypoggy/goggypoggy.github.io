class vert {
  constructor(P, N) {
    this.P = new vec3(P);
    if (N == undefined) this.N = new vec3(0);
    else this.N = new vec3(N);
  }
}

class prim {
  constructor(V, I) {
    this.V = V;
    this.I = I;
    this.VBuf = gl.createBuffer();
    this.IBuf = gl.createBuffer();
    this.VA = gl.createVertexArray();
    this.NumOfElem = 0;
    this.matrTrans = new mat4();
  }
  createNorms() {
    for (let i = 0; i < this.V.length; i++) this.V[i].N.set(0);

    for (let i = 0; i < this.I.length; i += 3) {
      let p0 = new vec3(this.V[this.I[i]].P);
      let p1 = new vec3(this.V[this.I[i + 1]].P);
      let p2 = new vec3(this.V[this.I[i + 2]].P);

      let n = p1.sub(p0).cross(p2.sub(p0)).norm();

      this.V[this.I[i]].N = this.V[this.I[i]].N.add(n);
      this.V[this.I[i + 1]].N = this.V[this.I[i + 1]].N.add(n);
      this.V[this.I[i + 2]].N = this.V[this.I[i + 2]].N.add(n);
    }

    for (let i = 0; i < this.V.length; i++) this.V[i].N.norm();
  }
  createBuffers() {
    let posBuf = [];

    for (let elem of this.V) {
      posBuf.push(elem.P.x);
      posBuf.push(elem.P.y);
      posBuf.push(elem.P.z);
      posBuf.push(elem.N.x);
      posBuf.push(elem.N.y);
      posBuf.push(elem.N.z);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
    gl.bufferData(gl.ARRAY_BUFFER, 4 * posBuf.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(posBuf), 0);

    gl.bindVertexArray(this.VA);
    let posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 6 * 4, 0);

    let normLoc = gl.getAttribLocation(shaderProgram, "in_norm");
    gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

    gl.enableVertexAttribArray(posLoc);
    gl.enableVertexAttribArray(normLoc);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 4 * this.I.length, gl.STATIC_DRAW);
    gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint32Array(this.I), 0);

    this.NumOfElem = this.I.length;

    return this;
  }
  draw() {
    let matrWTr = this.matrTrans.mulMatr(matrW);
    let matrWVP = this.matrTrans.mulMatr(matrW).mulMatr(matrVP);
    let posWVP = gl.getUniformLocation(shaderProgram, "MatrWVP");

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.UNIFORM_BUFFER, MatrBuf);
    gl.bufferData(gl.UNIFORM_BUFFER, 4 * 16 * 2 + 4 * 4, gl.STATIC_DRAW);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(matrWVP.toArray()), 0);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16, new Float32Array(matrWTr.toArray()), 0);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16 * 2, new Float32Array([camera.loc.x, camera.loc.y, camera.loc.z, 1]), 0);

    let bufPos = gl.getUniformBlockIndex(shaderProgram, "UBuf");
    gl.uniformBlockBinding(shaderProgram, bufPos, 0);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, MatrBuf);

    gl.bindVertexArray(this.VA);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
    gl.drawElements(gl.TRIANGLES, this.NumOfElem, gl.UNSIGNED_INT, this.IBuf);
  }
}

function vertRefToTrg(Vref, Iref, Vtrg, Itrg) {
  for (let i = 0; i < Iref.length; i++) {
    Itrg.push(i);
    Vtrg.push(new vert(new vec3(Vref[Iref[i]].P.x, Vref[Iref[i]].P.y, Vref[Iref[i]].P.z)));
  }
}