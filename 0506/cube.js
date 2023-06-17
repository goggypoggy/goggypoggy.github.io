class cube {
  constructor(size, pos) {
    size = size / 2;
    let Vref = [
      new vert(new vec3(-size, -size, -size)), // 0
      new vert(new vec3(-size, size, -size)), // 1
      new vert(new vec3(size, size, -size)), // 2
      new vert(new vec3(size, -size, -size)), // 3
      new vert(new vec3(-size, -size, size)), // 4
      new vert(new vec3(-size, size, size)), // 5
      new vert(new vec3(size, size, size)), // 6
      new vert(new vec3(size, -size, size)) // 7
    ];
    let Iref = [
      0, 1, 2, 0, 3, 2,
      0, 1, 5, 0, 4, 5,
      4, 5, 6, 4, 7, 6,
      3, 2, 6, 3, 7, 6,
      0, 4, 7, 0, 3, 7,
      1, 2, 6, 1, 5, 6
    ];
    let V = [], I = []; 
    vertRefToTrg(Vref, Iref, V, I);

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
