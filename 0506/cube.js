class cube {
  constructor(size, pos) {
    let V = [
      new vert(new vec3(size, size, -size)),   // 0
      new vert(new vec3(-size, size, -size)),  // 1
      new vert(new vec3(-size, -size, -size)), // 2
      new vert(new vec3(size, -size, -size)),  // 3

      new vert(new vec3(size, size, size)),    // 4
      new vert(new vec3(-size, size, size)),   // 5
      new vert(new vec3(-size, -size, size)),  // 6
      new vert(new vec3(size, -size, size)),   // 7

      new vert(new vec3(size, size, -size)),   // 0 8
      new vert(new vec3(size, -size, -size)),  // 3 9
      new vert(new vec3(size, size, size)),    // 4 10
      new vert(new vec3(size, -size, size)),   // 7 11

      new vert(new vec3(-size, size, -size)),  // 1 12
      new vert(new vec3(-size, -size, -size)), // 2 13
      new vert(new vec3(-size, size, size)),   // 5 14
      new vert(new vec3(-size, -size, size)),  // 6 15

      new vert(new vec3(-size, -size, -size)), // 2 16
      new vert(new vec3(size, -size, -size)),  // 3 17
      new vert(new vec3(-size, -size, size)),  // 6 18
      new vert(new vec3(size, -size, size)),   // 7 19

      new vert(new vec3(size, size, -size)),   // 0 20
      new vert(new vec3(-size, size, -size)),  // 1 21
      new vert(new vec3(size, size, size)),    // 4 22
      new vert(new vec3(-size, size, size)),   // 5 23
    ];
    let I = [
      0, 1, 2, 0, 2, 3, // front side
      4, 5, 6, 4, 6, 7, // back side
      8, 9, 10, 9, 10, 11, // right side
      13, 12, 14, 13, 15, 14, // left side
      16, 17, 18, 17, 18, 19, // lower side
      20, 21, 22, 21, 22, 23, // upper side
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
    this.Pr.matrTrans = this.Pr.matrTrans.matrRotateY(this.angle).mulMatr(this.Pr.matrTrans.matrTranslate(this.pos));
  }
}
