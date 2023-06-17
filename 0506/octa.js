class octa {
  constructor(size, pos, doesRotate) {
    size = size / 2;
    let Vref = [
      new vert(new vec3(-size / 2, 0, -size / 2)), // 0
      new vert(new vec3(-size / 2, 0, size / 2)), // 1
      new vert(new vec3(size / 2, 0, size / 2)), // 2
      new vert(new vec3(size / 2, 0, -size / 2)), // 3
      new vert(new vec3(0, size / Math.sqrt(2), 0)), // 4
      new vert(new vec3(0, -size / Math.sqrt(2), 0)), // 5
    ];
    let Iref = [
      0, 1, 4, 1, 2, 4, 2, 3, 4, 0, 3, 4, 0, 1, 5, 1, 2, 5, 2, 3, 5, 0, 3, 5,
    ];
    let V = [],
      I = [];
    vertRefToTrg(Vref, Iref, V, I);

    this.Pr = new prim(V, I);
    this.Pr.createNorms();
    this.Pr.createBuffers();

    if (pos != undefined) this.pos = pos;
    else this.pos = new vec3(0);
    if (doesRotate == undefined) this.doesRotate = true;
    else this.doesRotate = doesRotate;
    this.angle = 0;

    this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
  }
  draw() {
    this.Pr.draw();
  }
  response() {
    if (this.doesRotate == true) {
      this.angle += Time.localDelta * 180;
      let matr = new mat4();
      this.Pr.matrTrans = matr
        .matrRotateX(this.angle)
        .rotY(this.angle)
        .mulMatr(matr.matrTranslate(this.pos));
    }
  }
}
