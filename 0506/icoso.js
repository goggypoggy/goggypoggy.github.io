class icoso {
  constructor(size, pos, doesRotate) {
    let r = size * Math.sqrt(5 + Math.sqrt(5)) / Math.sqrt(10);
    let h = Math.sqrt(3 / 4 * size * size - r * r * (1 - Math.cos(D2R(36))) * (1 - Math.cos(D2R(36)))) / 2;
    let c = Math.sqrt(size * size - r * r);
    let Vref = [
      new vert(new vec3(0, h + c, 0)), // 0
      new vert(new vec3(0, -h - c, 0)), // 1
      new vert(new vec3(r * Math.cos(D2R(0)), h, r * Math.sin(D2R(0)))), // 2
      new vert(new vec3(r * Math.cos(D2R(72)), h, r * Math.sin(D2R(72)))), // 3
      new vert(new vec3(r * Math.cos(D2R(144)), h, r * Math.sin(D2R(144)))), // 4
      new vert(new vec3(r * Math.cos(D2R(216)), h, r * Math.sin(D2R(216)))), // 5
      new vert(new vec3(r * Math.cos(D2R(288)), h, r * Math.sin(D2R(288)))), // 6
      new vert(new vec3(r * Math.cos(D2R(0 + 36)), -h, r * Math.sin(D2R(0 + 36)))), // 2
      new vert(new vec3(r * Math.cos(D2R(72 + 36)), -h, r * Math.sin(D2R(72 + 36)))), // 3
      new vert(new vec3(r * Math.cos(D2R(144 + 36)), -h, r * Math.sin(D2R(144 + 36)))), // 4
      new vert(new vec3(r * Math.cos(D2R(216 + 36)), -h, r * Math.sin(D2R(216 + 36)))), // 5
      new vert(new vec3(r * Math.cos(D2R(288 + 36)), -h, r * Math.sin(D2R(288 + 36)))), // 6
    ];
    let Iref = [
        // top cap
        2, 3, 0,
        3, 4, 0,
        4, 5, 0,
        5, 6, 0,
        6, 2, 0,
        // middle
        2, 3, 7,
        7, 8, 3,
        3, 4, 8,
        8, 9, 4,
        4, 5, 9,
        9, 10, 5,
        5, 6, 10,
        10, 11, 6,
        6, 2, 11,
        11, 7, 2,
        // bottom cap
        7, 8, 1,
        8, 9, 1,
        9, 10, 1,
        10, 11, 1,
        11, 7, 1,
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
