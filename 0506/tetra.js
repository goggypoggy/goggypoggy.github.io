class tetra {
  constructor(size, pos) {
    let V = [
      // points for size 1 tetraeder
      // (0, 0, -1/3[3]) front
      // (-0.5, 0, 1/6[3]) left back
      // (0.5, 0, 1/6[3]) right back
      // (0, 1/3[6], 0) top

      // bottom
      new vert(new vec3(0, -(size * Math.sqrt(6) / 9), (-size / 3) * Math.sqrt(3))),          // front
      new vert(new vec3(size * -0.5, -(size * Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))), // left back
      new vert(new vec3(size * 0.5, -(size *Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))),   // right back
      // left front
      new vert(new vec3(0, -(size *Math.sqrt(6) / 9), (-size / 3) * Math.sqrt(3))),           // front
      new vert(new vec3(size * -0.5, -(size *Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))),  // left back
      new vert(new vec3(0, ((size / 3) * Math.sqrt(6)) - (size * Math.sqrt(6) / 9), 0)),      // top
      // right front
      new vert(new vec3(0, -(size *Math.sqrt(6) / 9), (-size / 3) * Math.sqrt(3))),           // front
      new vert(new vec3(size * 0.5, -(size *Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))),   // right back
      new vert(new vec3(0, ((size / 3) * Math.sqrt(6)) - (size * Math.sqrt(6) / 9), 0)),      // top
      // back
      new vert(new vec3(size * -0.5, -(size *Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))),  // left back
      new vert(new vec3(size * 0.5, -(size *Math.sqrt(6) / 9), (size / 6) * Math.sqrt(3))),   // right back
      new vert(new vec3(0, ((size / 3) * Math.sqrt(6)) - (size * Math.sqrt(6) / 9), 0)),      // top
    ];
    let I = [
      //bottom
      0, 1, 2,
      // left front
      3, 4, 5,
      // right front
      6, 7, 8,
      // back
      9, 10, 11,
    ];

    this.Pr = new prim(V, I);
    this.Pr.createNorms();
    this.Pr.createBuffers();

    if (pos != undefined) this.pos = pos;
    else this.pos = new vec3(0);
    this.angle = 0;

    this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
  }
  draw() {
    this.Pr.draw();
  }
  response() {
    this.angle += Time.localDelta * 180;
    let matr = new mat4();
    this.Pr.matrTrans = matr
      .matrRotateX(this.angle)
      .rotY(this.angle)
      .mulMatr(matr.matrTranslate(this.pos));
  }
}
