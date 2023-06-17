class tetra {
  constructor(size, pos, doesRotate) {
    let Vref = [
      // front
      new vert(
        new vec3(
          0, 
          -((size * Math.sqrt(6)) / 9), 
          (-size / 3) * Math.sqrt(3)
        )
      ),
      // left back
      new vert(
        new vec3(
          size * -0.5,
          -((size * Math.sqrt(6)) / 9),
          (size / 6) * Math.sqrt(3)
        )
      ),
      // right back
      new vert(
        new vec3(
          size * 0.5,
          -((size * Math.sqrt(6)) / 9),
          (size / 6) * Math.sqrt(3)
        )
      ),
      // top
      new vert(
        new vec3(
          0,
          (size / 3) * Math.sqrt(6) - (size * Math.sqrt(6)) / 9,
          0
        )
      ),
    ];
    let Iref = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];

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
