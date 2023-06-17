class dodeca {
  constructor(size, pos, doesRotate) {
    let R = (size / 4) * (1 + Math.sqrt(5)) * Math.sqrt(3);
    let r1 = (size * Math.sqrt(5 + Math.sqrt(5))) / Math.sqrt(10);
    let r2 = r1 * (Math.sqrt(5) + 1) / 2;
    let h1 = Math.sqrt(R * R - r1 * r1);
    let h2 = Math.sqrt(R * R - r2 * r2);
    let Vref = [
      // top pentagon
      new vert(new vec3(r1 * Math.cos(D2R(0)), h1, r1 * Math.sin(D2R(0)))), // 0
      new vert(new vec3(r1 * Math.cos(D2R(72)), h1, r1 * Math.sin(D2R(72)))), // 1
      new vert(new vec3(r1 * Math.cos(D2R(144)), h1, r1 * Math.sin(D2R(144)))), // 2
      new vert(new vec3(r1 * Math.cos(D2R(216)), h1, r1 * Math.sin(D2R(216)))), // 3
      new vert(new vec3(r1 * Math.cos(D2R(288)), h1, r1 * Math.sin(D2R(288)))), // 4
      // bottom pentagon
      new vert(new vec3(r1 * Math.cos(D2R(0 + 36)), -h1, r1 * Math.sin(D2R(0 + 36)))), // 5
      new vert(new vec3(r1 * Math.cos(D2R(72 + 36)), -h1, r1 * Math.sin(D2R(72 + 36)))), // 6
      new vert(new vec3(r1 * Math.cos(D2R(144 + 36)), -h1, r1 * Math.sin(D2R(144 + 36)))), // 7
      new vert(new vec3(r1 * Math.cos(D2R(216 + 36)), -h1, r1 * Math.sin(D2R(216 + 36)))), // 8
      new vert(new vec3(r1 * Math.cos(D2R(288 + 36)), -h1, r1 * Math.sin(D2R(288 + 36)))), // 9
      // upper middle rim
      new vert(new vec3(r2 * Math.cos(D2R(0)), h2, r2 * Math.sin(D2R(0)))), // 10
      new vert(new vec3(r2 * Math.cos(D2R(72)), h2, r2 * Math.sin(D2R(72)))), // 11
      new vert(new vec3(r2 * Math.cos(D2R(144)), h2, r2 * Math.sin(D2R(144)))), // 12
      new vert(new vec3(r2 * Math.cos(D2R(216)), h2, r2 * Math.sin(D2R(216)))), // 13
      new vert(new vec3(r2 * Math.cos(D2R(288)), h2, r2 * Math.sin(D2R(288)))), // 14
      // bottom middle rim
      new vert(new vec3(r2 * Math.cos(D2R(0 + 36)), -h2, r2 * Math.sin(D2R(0 + 36)))), // 15
      new vert(new vec3(r2 * Math.cos(D2R(72 + 36)), -h2, r2 * Math.sin(D2R(72 + 36)))), // 16
      new vert(new vec3(r2 * Math.cos(D2R(144 + 36)), -h2, r2 * Math.sin(D2R(144 + 36)))), // 17
      new vert(new vec3(r2 * Math.cos(D2R(216 + 36)), -h2, r2 * Math.sin(D2R(216 + 36)))), // 18
      new vert(new vec3(r2 * Math.cos(D2R(288 + 36)), -h2, r2 * Math.sin(D2R(288 + 36)))), // 19
    ];
    let Iref = [
      // top pentagon
      0, 1, 2,
      0, 2, 3,
      0, 3, 4,
      // bottom pentagon
      5, 6, 7,
      5, 7, 8,
      5, 8, 9,
      // upper middle pentagons
      // 1
      0, 1, 11,
      0, 11, 15,
      0, 15, 10,
      // 2
      1, 2, 12,
      1, 12, 16,
      1, 16, 11,
      // 3
      2, 3, 13,
      2, 13, 17,
      2, 17, 12,
      // 4
      3, 4, 14,
      3, 14, 18,
      3, 18, 13,
      // 5
      4, 0, 10,
      4, 10, 19,
      4, 19, 14,
      // lower middle pentagons
      // 1
      5, 6, 16,
      5, 16, 11,
      5, 11, 15,
      // 2
      6, 7, 17,
      6, 17, 12,
      6, 12, 16,
      // 3
      7, 8, 18,
      7, 18, 13,
      7, 13, 17,
      // 4
      8, 9, 19,
      8, 19, 14,
      8, 14, 18,
      // 5
      9, 5, 15,
      9, 15, 10,
      9, 10, 19,
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
        .matrRotateY(this.angle)
        .rotX(this.angle)
        .mulMatr(matr.matrTranslate(this.pos));
    }
  }
}
