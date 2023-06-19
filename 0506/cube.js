import { Time } from "./timer.js";
import { vec3, mat4 } from "./mth.js";
import { vert, prim, vertRefToTrg } from "./prim.js";

export class cube {
  constructor(size, pos, doesRotate) {
    let Vref = [
      new vert(new vec3(-size / 2, -size / 2, -size / 2)), // 0
      new vert(new vec3(-size / 2, size / 2, -size / 2)), // 1
      new vert(new vec3(size / 2, size / 2, -size / 2)), // 2
      new vert(new vec3(size / 2, -size / 2, -size / 2)), // 3
      new vert(new vec3(-size / 2, -size / 2, size / 2)), // 4
      new vert(new vec3(-size / 2, size / 2, size / 2)), // 5
      new vert(new vec3(size / 2, size / 2, size / 2)), // 6
      new vert(new vec3(size / 2, -size / 2, size / 2)), // 7
    ];
    let Iref = [
      0, 1, 2, 0, 3, 2, 0, 1, 5, 0, 4, 5, 4, 5, 6, 4, 7, 6, 3, 2, 6, 3, 7, 6, 0,
      4, 7, 0, 3, 7, 1, 2, 6, 1, 5, 6,
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
