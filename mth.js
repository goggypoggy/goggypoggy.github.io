export { vec3, mat4 };

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

class mat4 {
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
      this.a = a00.a;
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

  translate(v) {
    return new mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1);
  }

  scale(v) {
    return new mat4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
  }

  mulMatr(m) {
    let mr = new mat4(0);
    let i;
    let j;
    let k;
    let a;

    for (i = 0; i < 4; i++)
      for (j = 0; j < 4; j++) {
        for (k = 0, a = 0; k < 4; k++) mr.a[i][j] += this.a[k][j] * m.a[i][k];
      }

    return mr;
  }

  transpose() {
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
        this.a[0][0] * mat3determ(this.a[1][1], this.a[1][2], this.a[1][3],
            this.a[2][1], this.a[2][2], this.a[2][3],
            this.a[3][1], this.a[3][2], this.a[3][3]) -
        this.a[0][1] * mat3determ(this.a[1][0], this.a[1][2], this.a[1][3],
          this.a[2][0], this.a[2][2], this.a[2][3],
          this.a[3][0], this.a[3][2], this.a[3][3]) +
        this.a[0][2] * mat3determ(this.a[1][0], this.a[1][1], this.a[1][3],
          this.a[2][0], this.a[2][1], this.a[2][3],
          this.a[3][0], this.a[3][1], this.a[3][3]) -
        this.a[0][3] * mat3determ(this.a[1][0], this.a[1][1], this.a[1][2],
          this.a[2][0], this.a[2][1], this.a[2][2],
          this.a[3][0], this.a[3][1], this.a[3][2])
        );
  }

  viewMatr(loc, at, up1) {
    let dir = at.sub(loc).norm();
    let right = dir.cross(up1).norm();
    let up = right.cross(dir);

    return new mat4(right.x, up.x, -dir.x, 0,
        right.x, up.x, -dir.x, 0,
        right.x, up.x, -dir.x, 0,
        -loc.dot(right), -loc.dot(up), loc.dot(dir), 1);
  }
  
}

class vec3 {
  constructor(x, y, z) {
    if (x == undefined) (this.x = 0), (this.y = 0), (this.z = 0);
    else if (typeof x == "object")
      (this.x = x.x), (this.y = x.y), (this.z = x.z);
    else if (y == undefined) (this.x = x), (this.y = x), (this.z = x);
    else (this.x = x), (this.y = y), (this.z = z);
  }

  set(x, y, z) {
    (this.x = x), (this.y = y), (this.z = z);
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
}
