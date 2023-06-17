import { gl } from "./shader.js";
import { Time } from "./timer.js";
import { input } from "./input.js";

function mat3determ(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
  return (
    a00 * a11 * a22 +
    a01 * a12 * a20 +
    a02 * a10 * a21 -
    a02 * a11 * a20 -
    a01 * a10 * a22 -
    a00 * a12 * a21
  );
}

export const pi = 3.14159265358979323846;

export function D2R(A) {
  return A * (pi / 180.0);
}

export function R2D(R) {
  return (R / pi) * 180.0;
}

export class mat4 {
  constructor(
    a00,
    a01,
    a02,
    a03,
    a10,
    a11,
    a12,
    a13,
    a20,
    a21,
    a22,
    a23,
    a30,
    a31,
    a32,
    a33
  ) {
    this.a = [];
    this.a[0] = [];
    this.a[1] = [];
    this.a[2] = [];
    this.a[3] = [];

    if (typeof a00 == "object") {
      // mat4 from mat4 object in a00
      this.a[0][0] = a00.a[0][0];
      this.a[0][1] = a00.a[0][1];
      this.a[0][2] = a00.a[0][2];
      this.a[0][3] = a00.a[0][3];
      this.a[1][0] = a00.a[1][0];
      this.a[1][1] = a00.a[1][1];
      this.a[1][2] = a00.a[1][2];
      this.a[1][3] = a00.a[1][3];
      this.a[2][0] = a00.a[2][0];
      this.a[2][1] = a00.a[2][1];
      this.a[2][2] = a00.a[2][2];
      this.a[2][3] = a00.a[2][3];
      this.a[3][0] = a00.a[3][0];
      this.a[3][1] = a00.a[3][1];
      this.a[3][2] = a00.a[3][2];
      this.a[3][3] = a00.a[3][3];
    } else if (a00 != undefined && a01 == undefined) {
      // mat4 filled with a00
      this.a[0][0] = a00;
      this.a[0][1] = a00;
      this.a[0][2] = a00;
      this.a[0][3] = a00;
      this.a[1][0] = a00;
      this.a[1][1] = a00;
      this.a[1][2] = a00;
      this.a[1][3] = a00;
      this.a[2][0] = a00;
      this.a[2][1] = a00;
      this.a[2][2] = a00;
      this.a[2][3] = a00;
      this.a[3][0] = a00;
      this.a[3][1] = a00;
      this.a[3][2] = a00;
      this.a[3][3] = a00;
    } else if (a00 == undefined) {
      // unit mat4 if no args
      this.a[0][0] = 1;
      this.a[0][1] = 0;
      this.a[0][2] = 0;
      this.a[0][3] = 0;
      this.a[1][0] = 0;
      this.a[1][1] = 1;
      this.a[1][2] = 0;
      this.a[1][3] = 0;
      this.a[2][0] = 0;
      this.a[2][1] = 0;
      this.a[2][2] = 1;
      this.a[2][3] = 0;
      this.a[3][0] = 0;
      this.a[3][1] = 0;
      this.a[3][2] = 0;
      this.a[3][3] = 1;
    } else {
      // mat4 manual construction
      this.a[0][0] = a00;
      this.a[0][1] = a01;
      this.a[0][2] = a02;
      this.a[0][3] = a03;
      this.a[1][0] = a10;
      this.a[1][1] = a11;
      this.a[1][2] = a12;
      this.a[1][3] = a13;
      this.a[2][0] = a20;
      this.a[2][1] = a21;
      this.a[2][2] = a22;
      this.a[2][3] = a23;
      this.a[3][0] = a30;
      this.a[3][1] = a31;
      this.a[3][2] = a32;
      this.a[3][3] = a33;
    }
  }
  set(
    a00,
    a01,
    a02,
    a03,
    a10,
    a11,
    a12,
    a13,
    a20,
    a21,
    a22,
    a23,
    a30,
    a31,
    a32,
    a33
  ) {
    if (typeof a00 == "object") {
      // mat4 from mat4 object in a00
      this.a[0][0] = a00.a[0][0];
      this.a[0][1] = a00.a[0][1];
      this.a[0][2] = a00.a[0][2];
      this.a[0][3] = a00.a[0][3];
      this.a[1][0] = a00.a[1][0];
      this.a[1][1] = a00.a[1][1];
      this.a[1][2] = a00.a[1][2];
      this.a[1][3] = a00.a[1][3];
      this.a[2][0] = a00.a[2][0];
      this.a[2][1] = a00.a[2][1];
      this.a[2][2] = a00.a[2][2];
      this.a[2][3] = a00.a[2][3];
      this.a[3][0] = a00.a[3][0];
      this.a[3][1] = a00.a[3][1];
      this.a[3][2] = a00.a[3][2];
      this.a[3][3] = a00.a[3][3];
    } else if (a00 != undefined && a01 == undefined) {
      // mat4 filled with a00
      this.a[0][0] = a00;
      this.a[0][1] = a00;
      this.a[0][2] = a00;
      this.a[0][3] = a00;
      this.a[1][0] = a00;
      this.a[1][1] = a00;
      this.a[1][2] = a00;
      this.a[1][3] = a00;
      this.a[2][0] = a00;
      this.a[2][1] = a00;
      this.a[2][2] = a00;
      this.a[2][3] = a00;
      this.a[3][0] = a00;
      this.a[3][1] = a00;
      this.a[3][2] = a00;
      this.a[3][3] = a00;
    } else if (a00 == undefined) {
      // unit mat4 if no args
      this.a[0][0] = 1;
      this.a[0][1] = 0;
      this.a[0][2] = 0;
      this.a[0][3] = 0;
      this.a[1][0] = 0;
      this.a[1][1] = 1;
      this.a[1][2] = 0;
      this.a[1][3] = 0;
      this.a[2][0] = 0;
      this.a[2][1] = 0;
      this.a[2][2] = 1;
      this.a[2][3] = 0;
      this.a[3][0] = 0;
      this.a[3][1] = 0;
      this.a[3][2] = 0;
      this.a[3][3] = 1;
    } else {
      // mat4 manual construction
      this.a[0][0] = a00;
      this.a[0][1] = a01;
      this.a[0][2] = a02;
      this.a[0][3] = a03;
      this.a[1][0] = a10;
      this.a[1][1] = a11;
      this.a[1][2] = a12;
      this.a[1][3] = a13;
      this.a[2][0] = a20;
      this.a[2][1] = a21;
      this.a[2][2] = a22;
      this.a[2][3] = a23;
      this.a[3][0] = a30;
      this.a[3][1] = a31;
      this.a[3][2] = a32;
      this.a[3][3] = a33;
    }
    return this;
  }
  matrTranslate(v) {
    return new mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1);
  }
  matrScale(v) {
    return new mat4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
  }
  mulMatr(m) {
    let mr = new mat4(0);
    let i, j, k;

    for (i = 0; i < 4; i++)
      for (j = 0; j < 4; j++) {
        for (k = 0; k < 4; k++) mr.a[i][j] += this.a[i][k] * m.a[k][j];
      }

    return mr;
  }
  matrTranspose() {
    let mr = new mat4(
      this.a[0][0],
      this.a[1][0],
      this.a[2][0],
      this.a[3][0],
      this.a[0][1],
      this.a[1][1],
      this.a[2][1],
      this.a[3][1],
      this.a[0][2],
      this.a[1][2],
      this.a[2][2],
      this.a[3][2],
      this.a[0][3],
      this.a[1][3],
      this.a[2][3],
      this.a[3][3]
    );

    return mr;
  }
  determ() {
    return (
      this.a[0][0] *
        mat3determ(
          this.a[1][1],
          this.a[1][2],
          this.a[1][3],
          this.a[2][1],
          this.a[2][2],
          this.a[2][3],
          this.a[3][1],
          this.a[3][2],
          this.a[3][3]
        ) -
      this.a[0][1] *
        mat3determ(
          this.a[1][0],
          this.a[1][2],
          this.a[1][3],
          this.a[2][0],
          this.a[2][2],
          this.a[2][3],
          this.a[3][0],
          this.a[3][2],
          this.a[3][3]
        ) +
      this.a[0][2] *
        mat3determ(
          this.a[1][0],
          this.a[1][1],
          this.a[1][3],
          this.a[2][0],
          this.a[2][1],
          this.a[2][3],
          this.a[3][0],
          this.a[3][1],
          this.a[3][3]
        ) -
      this.a[0][3] *
        mat3determ(
          this.a[1][0],
          this.a[1][1],
          this.a[1][2],
          this.a[2][0],
          this.a[2][1],
          this.a[2][2],
          this.a[3][0],
          this.a[3][1],
          this.a[3][2]
        )
    );
  }
  matrView(loc, at, up1) {
    let dir = at.sub(loc).norm();
    let right = dir.cross(up1).norm();
    let up = right.cross(dir);

    return new mat4(
      right.x,
      up.x,
      -dir.x,
      0,
      right.y,
      up.y,
      -dir.y,
      0,
      right.z,
      up.z,
      -dir.z,
      0,
      -loc.dot(right),
      -loc.dot(up),
      loc.dot(dir),
      1
    );
  }
  matrFrustrum(l, r, b, t, n, f) {
    return new mat4(
      (2 * n) / (r - l),
      0,
      0,
      0,
      0,
      (2 * n) / (t - b),
      0,
      0,
      (r + l) / (r - l),
      (t + b) / (t - b),
      -(f + n) / (f - n),
      -1,
      0,
      0,
      (-2 * n * f) / (f - n),
      0
    );
  }
  toArray() {
    let b = [];

    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) b.push(this.a[i][j]);

    return b;
  }
  matrRotateX(a) {
    let ra = D2R(a);
    let si = Math.sin(ra),
      co = Math.cos(ra);

    return new mat4(1, 0, 0, 0, 0, co, si, 0, 0, -si, co, 0, 0, 0, 0, 1);
  }
  matrRotateY(a) {
    let ra = D2R(a);
    let si = Math.sin(ra),
      co = Math.cos(ra);

    return new mat4(co, 0, -si, 0, 0, 1, 0, 0, si, 0, co, 0, 0, 0, 0, 1);
  }
  matrRotateZ(a) {
    let ra = D2R(a);
    let si = Math.sin(ra),
      co = Math.cos(ra);

    return new mat4(co, si, 0, 0, -si, co, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }
  rotX(a) {
    return this.set(this.mulMatr(this.matrRotateX(a)));
  }
  rotY(a) {
    return this.set(this.mulMatr(this.matrRotateY(a)));
  }
  rotZ(a) {
    return this.set(this.mulMatr(this.matrRotateZ(a)));
  }
}

export class vec3 {
  constructor(x, y, z) {
    if (x == undefined) (this.x = 0), (this.y = 0), (this.z = 0);
    else if (typeof x == "object")
      (this.x = x.x), (this.y = x.y), (this.z = x.z);
    else if (y == undefined) (this.x = x), (this.y = x), (this.z = x);
    else (this.x = x), (this.y = y), (this.z = z);
    return this;
  }
  set(x, y, z) {
    if (x == undefined) (this.x = 0), (this.y = 0), (this.z = 0);
    else if (typeof x == "object")
      (this.x = x.x), (this.y = x.y), (this.z = x.z);
    else if (y == undefined) (this.x = x), (this.y = x), (this.z = x);
    else (this.x = x), (this.y = y), (this.z = z);
    return this;
  }
  add(x, y, z) {
    if (typeof x == "object")
      return new vec3(this.x + x.x, this.y + x.y, this.z + x.z);
    else if (x != undefined && y != undefined && z != undefined)
      return new vec3(this.x + x, this.y + y, this.z + z);
    else if (x != undefined)
      return new vec3(this.x + x, this.y + x, this.z + x);
    else return new vec3(this);
  }
  sub(x, y, z) {
    if (typeof x == "object")
      return new vec3(this.x - x.x, this.y - x.y, this.z - x.z);
    else if (x != undefined && y != undefined && z != undefined)
      return new vec3(this.x - x, this.y - y, this.z - z);
    else if (x != undefined)
      return new vec3(this.x - x, this.y - x, this.z - x);
    else return new vec3(this);
  }
  mulNum(n) {
    if (n == undefined || typeof n != "number") return new vec3(this);
    else return new vec3(this.x * n, this.y * n, this.z * n);
  }
  divNum(n) {
    if (n == undefined || typeof n != "number") return new vec3(this);
    else return new vec3(this.x / n, this.y / n, this.z / n);
  }
  neg() {
    return new vec3(-this.x, -this.y, -this.z);
  }
  dot(x, y, z) {
    if (typeof x == "object") return this.x * x.x + this.y * x.y + this.z * x.z;
    else if (x != undefined && y != undefined && z != undefined)
      return this.x * x + this.y * y + this.z * z;
    else if (x != undefined) return this.x * x + this.y * x + this.z * x;
    else return this;
  }
  cross(x, y, z) {
    if (typeof x == "object")
      return new vec3(
        this.y * x.z - this.z * x.y,
        this.z * x.x - this.x * x.z,
        this.x * x.y - this.y * x.x
      );
    else if (x != undefined && y != undefined && z != undefined)
      return new vec3(
        this.y * z - this.z * y,
        this.z * x - this.x * z,
        this.x * y - this.y * x
      );
    else if (x != undefined)
      return new vec3(
        this.y * x - this.z * x,
        this.z * x - this.x * x,
        this.x * x - this.y * x
      );
    else return new vec3(0);
  }
  len2() {
    return this.dot(this);
  }
  len() {
    return Math.sqrt(this.dot(this));
  }
  norm() {
    let len2 = this.dot(this);

    if (len2 == 1 || len2 == 0) return this;
    else return this.divNum(Math.sqrt(len2));
  }
  pointTransfrom(m) {
    return new vec3(
      this.x * m.a[0][0] +
        this.y * m.a[1][0] +
        this.z * m.a[2][0] +
        1 * m.a[3][0],
      this.x * m.a[0][1] +
        this.y * m.a[1][1] +
        this.z * m.a[2][1] +
        1 * m.a[3][1],
      this.x * m.a[0][2] +
        this.y * m.a[1][2] +
        this.z * m.a[2][2] +
        1 * m.a[3][2]
    );
  }
}

class cam {
  configMatr = () => {
    let rx = this.projSize,
      ry = this.projSize;

    if (gl.canvas.width > gl.canvas.height)
      rx *= gl.canvas.width / gl.canvas.height;
    else ry *= gl.canvas.height / gl.canvas.width;

    this.matrV = this.matrV.matrView(this.loc, this.at, this.up);
    this.matrP = this.matrP.matrFrustrum(
      -rx / 2,
      rx / 2,
      -ry / 2,
      ry / 2,
      this.projDist,
      this.projFarClip
    );
    this.matrVP = this.matrV.mulMatr(this.matrP);
  };
  constructor(loc, at, up) {
    if (loc != undefined) this.loc = new vec3(loc);
    else this.loc = new vec3(0, 0, 10);
    if (at != undefined) this.at = new vec3(at);
    else this.at = new vec3(0);
    if (up != undefined) this.up = new vec3(up);
    else this.up = new vec3(0, 1, 0);
    this.matrV = new mat4();
    this.matrP = new mat4();
    this.matrVP = new mat4();
    this.projDist = 1;
    this.projSize = 1;
    this.projFarClip = 3000000;

    this.configMatr();
  }
  set(loc, at, up) {
    if (loc != undefined) this.loc.set(loc);
    else this.loc.set(0, 0, 10);
    if (at != undefined) this.at.set(at);
    else this.at.set(0);
    if (up != undefined) this.up.set(up);
    else this.up.set(0, 1, 0);

    this.configMatr();
  }
  move() {
    let dist, cosT, sinT, plen, cosP, sinP, azimuth, elevator;

    dist = this.at.sub(this.loc).len();
    cosT = (this.loc.y - this.at.y) / dist;
    sinT = Math.sqrt(1 - cosT * cosT);

    plen = dist * sinT;
    cosP = (this.loc.z - this.at.z) / plen;
    sinP = (this.loc.x - this.at.x) / plen;

    azimuth = R2D(Math.atan2(sinP, cosP));
    elevator = R2D(Math.atan2(sinT, cosT));

    azimuth += Time.globalDelta * (-60 * input.mL * input.mdx);

    elevator += Time.globalDelta * (-60 * input.mL * input.mdy);

    elevator = Math.min(Math.max(0.01, elevator), 177.99);

    dist += Time.globalDelta * 8 * input.mdz;

    dist = Math.max(dist, 0.1);

    if (input.mR == 1) {
      let Wp, Hp, sx, sy, dv;

      Wp = this.projSize;
      Hp = this.projSize;
      if (gl.canvas.width > gl.canvas.height)
        Wp *= gl.canvas.width / gl.canvas.height;
      else Hp *= gl.canvas.height / gl.canvas.width;

      sx = (((-1 * input.mdx * Wp) / gl.canvas.width) * dist) / this.projDist;
      sy = (((-1 * input.mdy * Hp) / gl.canvas.height) * dist) / this.projDist;

      let dir = this.at.sub(this.loc).norm();
      let right = dir.cross(this.up).norm();
      let up1 = dir.cross(right);

      dv = right.mulNum(sx).add(up1.mulNum(sy));
      this.at = this.at.add(dv);
      this.loc = this.loc.add(dv);
    }

    let vec = new vec3(0, dist, 0);
    let matr = new mat4();
    this.set(
      vec.pointTransfrom(
        matr
          .matrRotateX(elevator)
          .mulMatr(matr.matrRotateY(azimuth))
          .mulMatr(matr.matrTranslate(this.at))
      ),
      this.at,
      this.up
    );
  }
}

export let camera = new cam(
  new vec3(1.5, 5, 14),
  new vec3(1.5, 0, 0),
  new vec3(0, 1, 0)
);
