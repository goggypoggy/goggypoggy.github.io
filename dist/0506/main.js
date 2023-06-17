(function () {
  'use strict';

  function getTime() {
    const date = new Date();
    return (
      date.getMilliseconds() / 1000.0 +
      date.getSeconds() +
      date.getMinutes() * 60.0
    );
  }

  class time {
    constructor() {
      this.start = this.old = this.oldFPS = getTime();
      this.paused = 0;
      this.frameCounter = 0;
      this.FPS = 30.0;
      this.global = 0;
      this.globalDelta = 0;
      this.local = 0;
      this.localDelta = 0;
      this.isPaused = false;
    }
    response() {
      let curTime = getTime();

      this.global = curTime - this.start;
      this.globalDelta = curTime - this.old;

      if (this.isPaused) {
        this.localDelta = 0;
        this.paused += curTime - this.old;
      } else {
        this.localDelta = this.globalDelta;
        this.local = this.global - this.paused;
      }

      this.frameCounter++;
      if (curTime - this.oldFPS > 1) {
        this.FPS = this.frameCounter / (curTime - this.oldFPS);
        this.oldFPS = curTime;
        this.frameCounter = 0;
      }

      this.old = curTime;
    }
  }

  let Time = new time();

  class inputHandler {
    constructor() {
      this.mx = 0;
      this.my = 0;
      this.mdx = 0;
      this.mdy = 0;
      this.mdz = 0;
      this.mL = 0;
      this.mR = 0;
      this.wasInput = false;
    }
    handleEvent(event) {
      switch (event.type) {
        case "mouseup":
          event.preventDefault();
          if (event.button == 0) this.mL = 0;
          else this.mR = 0;
          break;
        case "mousedown":
          event.preventDefault();
          if (event.button == 0) this.mL = 1;
          else this.mR = 1;
          break;
        case "wheel":
          event.preventDefault();
          this.mdz = event.deltaY / 10;
          break;
        default:
          this.mdx = this.mx - event.clientX;
          this.mdy = this.my - event.clientY;
          this.mx = event.clientX;
          this.my = event.clientY;
          break;
      }
      this.mdx *= -1;
      this.mdy *= -1;
      this.wasInput = true;
    }
    update() {
      if (this.wasInput) this.wasInput = false;
      else (this.mdx = 0), (this.mdy = 0), (this.mdz = 0);
    }
    inputsOut() {
      console.log([this.mx, this.my, this.mdx, this.mdy].join(" : "));
    }
  }

  let input = new inputHandler();

  var vert$1 = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 in_pos;in vec3 in_norm;out vec3 vs_Pos;out vec3 vs_Norm;out vec4 vs_Color;void main(void){gl_Position=MatrWVP*vec4(in_pos,1.0);vs_Pos=(MatrW*vec4(in_pos,1.0)).xyz;vs_Norm=mat3(MatrW)*in_norm;vs_Color=vec4(0.6,0.8,0.9,1.0);}"; // eslint-disable-line

  var frag = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 vs_Pos;in vec3 vs_Norm;in vec4 vs_Color;out vec4 outColor;void main(void){vec3 L=normalize(vec3(0.0,1.0,0.5));vec3 LC=vec3(1.0);vec3 Ka=vec3(0.1);vec3 Kd=vs_Color.xyz;vec3 Ks=vec3(0.8);float Ph=1.0;vec3 V=normalize(vs_Pos-CamPos.xyz);vec3 color=min(vec3(0.1),Ka);vec3 N=faceforward(vs_Norm,V,vs_Norm);color+=max(0.0,dot(N,L))*Kd*LC;vec3 R=reflect(V,N);color+=pow(max(0.0,dot(R,L)),Ph)*Ks*LC;outColor=vec4(color,1.0);}"; // eslint-disable-line

  let gl, shaderProgram;

  let canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");

  function loadShader(type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const buf = gl.getShaderInfoLog(shader);
      console.log("Compiling error:");
      console.log(buf);
    }

    return shader;
  }

  function shaderInit() {
    return new Promise((resolve, reject) => {
      const vsh = loadShader(gl.VERTEX_SHADER, vert$1);
      const fsh = loadShader(gl.FRAGMENT_SHADER, frag);

      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vsh);
      gl.attachShader(shaderProgram, fsh);
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        const Buf = gl.getProgramInfoLog(shaderProgram);
        reject(Buf);
      }
      resolve();
    });
  }

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

  const pi = 3.14159265358979323846;

  function D2R(A) {
    return A * (pi / 180.0);
  }

  function R2D(R) {
    return (R / pi) * 180.0;
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

  class vec3 {
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

  let camera = new cam(
    new vec3(1.5, 5, 14),
    new vec3(1.5, 0, 0),
    new vec3(0, 1, 0)
  );

  let matrW = new mat4();

  let MatrBuf = gl.createBuffer();

  class vert {
    constructor(P, N) {
      this.P = new vec3(P);
      if (N == undefined) this.N = new vec3(0);
      else this.N = new vec3(N);
    }
  }

  class prim {
    constructor(V, I) {
      this.V = V;
      this.I = I;
      this.VBuf = gl.createBuffer();
      this.IBuf = gl.createBuffer();
      this.VA = gl.createVertexArray();
      this.NumOfElem = 0;
      this.matrTrans = new mat4();
    }
    createNorms() {
      for (let i = 0; i < this.V.length; i++) this.V[i].N.set(0);

      for (let i = 0; i < this.I.length; i += 3) {
        let p0 = new vec3(this.V[this.I[i]].P);
        let p1 = new vec3(this.V[this.I[i + 1]].P);
        let p2 = new vec3(this.V[this.I[i + 2]].P);

        let n = p1.sub(p0).cross(p2.sub(p0)).norm();

        this.V[this.I[i]].N = this.V[this.I[i]].N.add(n);
        this.V[this.I[i + 1]].N = this.V[this.I[i + 1]].N.add(n);
        this.V[this.I[i + 2]].N = this.V[this.I[i + 2]].N.add(n);
      }

      for (let i = 0; i < this.V.length; i++) this.V[i].N.norm();
    }
    createBuffers() {
      let posBuf = [];

      for (let elem of this.V) {
        posBuf.push(elem.P.x);
        posBuf.push(elem.P.y);
        posBuf.push(elem.P.z);
        posBuf.push(elem.N.x);
        posBuf.push(elem.N.y);
        posBuf.push(elem.N.z);
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
      gl.bufferData(gl.ARRAY_BUFFER, 4 * posBuf.length, gl.STATIC_DRAW);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(posBuf), 0);

      gl.bindVertexArray(this.VA);
      let posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 6 * 4, 0);

      let normLoc = gl.getAttribLocation(shaderProgram, "in_norm");
      gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

      gl.enableVertexAttribArray(posLoc);
      gl.enableVertexAttribArray(normLoc);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 4 * this.I.length, gl.STATIC_DRAW);
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint32Array(this.I), 0);

      this.NumOfElem = this.I.length;

      return this;
    }
    draw() {
      let matrWTr = this.matrTrans.mulMatr(matrW);
      let matrWVP = this.matrTrans.mulMatr(matrW).mulMatr(camera.matrVP);
      gl.getUniformLocation(shaderProgram, "MatrWVP");

      gl.useProgram(shaderProgram);

      gl.bindBuffer(gl.UNIFORM_BUFFER, MatrBuf);
      gl.bufferData(gl.UNIFORM_BUFFER, 4 * 16 * 2 + 4 * 4, gl.STATIC_DRAW);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(matrWVP.toArray()), 0);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16, new Float32Array(matrWTr.toArray()), 0);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16 * 2, new Float32Array([camera.loc.x, camera.loc.y, camera.loc.z, 1]), 0);

      let bufPos = gl.getUniformBlockIndex(shaderProgram, "UBuf");
      gl.uniformBlockBinding(shaderProgram, bufPos, 0);
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, MatrBuf);

      gl.bindVertexArray(this.VA);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
      gl.drawElements(gl.TRIANGLES, this.NumOfElem, gl.UNSIGNED_INT, this.IBuf);
    }
  }

  function vertRefToTrg(Vref, Iref, Vtrg, Itrg) {
    for (let i = 0; i < Iref.length; i++) {
      Itrg.push(i);
      Vtrg.push(new vert(new vec3(Vref[Iref[i]].P.x, Vref[Iref[i]].P.y, Vref[Iref[i]].P.z)));
    }
  }

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
          .matrRotateY(this.angle)
          .rotX(this.angle)
          .mulMatr(matr.matrTranslate(this.pos));
      }
    }
  }

  class octa {
    constructor(size, pos, doesRotate) {
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
          .matrRotateY(this.angle)
          .rotX(this.angle)
          .mulMatr(matr.matrTranslate(this.pos));
      }
    }
  }

  class cube {
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
          .matrRotateY(this.angle)
          .rotX(this.angle)
          .mulMatr(matr.matrTranslate(this.pos));
      }
    }
  }

  let Scene = [];

  async function GLInit() {
    return new Promise((resolve, reject) => {
      shaderInit();

      shaderInit()
        .then((res) => {
          Scene.push(new tetra(1, new vec3(-3, 0, 1.5)));
          Scene.push(new octa(1, new vec3(0, 0, 1.5)));
          Scene.push(new cube(1, new vec3(3, 0, 1.5)));
          Scene.push(new dodeca(1, new vec3(6, 0, 1.5)));
          Scene.push(new icoso(1, new vec3(9, 0, 1.5)));

          Scene.push(new tetra(1, new vec3(-3, 0, -1.5), false));
          Scene.push(new octa(1, new vec3(0, 0, -1.5), false));
          Scene.push(new cube(1, new vec3(3, 0, -1.5), false));
          Scene.push(new dodeca(1, new vec3(6, 0, -1.5), false));
          Scene.push(new icoso(1, new vec3(9, 0, -1.5), false));

          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function cycle() {
    gl.clearColor(0.2, 0.47, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    input.update();
    Time.response();
    camera.move();

    for (let elem of Scene) if (elem.response != undefined) elem.response();

    for (let elem of Scene) if (elem.draw != undefined) elem.draw();

    window.requestAnimationFrame(cycle);
  }

  let glCanvas = document.getElementById("glCanvas");

  window.addEventListener("mouseup", (event)=>{
    input.handleEvent(event);
  });
  glCanvas.addEventListener("mousedown", (event)=>{
    input.handleEvent(event);
  });
  window.addEventListener("mousemove", (event)=>{
    input.handleEvent(event);
  });
  glCanvas.addEventListener("wheel", (event)=>{
    input.handleEvent(event);
  });

  function main() {
    const init = GLInit();
    init
      .then((res) => {
        cycle();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  window.addEventListener("load", main);

})();
