(function () {
  'use strict';

  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return exports;
    };
    var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      defineProperty = Object.defineProperty || function (obj, key, desc) {
        obj[key] = desc.value;
      },
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
    function define(obj, key, value) {
      return Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), obj[key];
    }
    try {
      define({}, "");
    } catch (err) {
      define = function (obj, key, value) {
        return obj[key] = value;
      };
    }
    function wrap(innerFn, outerFn, self, tryLocsList) {
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
      return defineProperty(generator, "_invoke", {
        value: makeInvokeMethod(innerFn, self, context)
      }), generator;
    }
    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }
    exports.wrap = wrap;
    var ContinueSentinel = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var IteratorPrototype = {};
    define(IteratorPrototype, iteratorSymbol, function () {
      return this;
    });
    var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        define(prototype, method, function (arg) {
          return this._invoke(method, arg);
        });
      });
    }
    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if ("throw" !== record.type) {
          var result = record.arg,
            value = result.value;
          return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
            invoke("next", value, resolve, reject);
          }, function (err) {
            invoke("throw", err, resolve, reject);
          }) : PromiseImpl.resolve(value).then(function (unwrapped) {
            result.value = unwrapped, resolve(result);
          }, function (error) {
            return invoke("throw", error, resolve, reject);
          });
        }
        reject(record.arg);
      }
      var previousPromise;
      defineProperty(this, "_invoke", {
        value: function (method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }
          return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");
        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }
        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }
          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);
          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }
          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }
    function maybeInvokeDelegate(delegate, context) {
      var methodName = context.method,
        method = delegate.iterator[methodName];
      if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
      var record = tryCatch(method, delegate.iterator, context.arg);
      if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
      var info = record.arg;
      return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
    }
    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };
      1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
    }
    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal", delete record.arg, entry.completion = record;
    }
    function Context(tryLocsList) {
      this.tryEntries = [{
        tryLoc: "root"
      }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) return iteratorMethod.call(iterable);
        if ("function" == typeof iterable.next) return iterable;
        if (!isNaN(iterable.length)) {
          var i = -1,
            next = function next() {
              for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
              return next.value = undefined, next.done = !0, next;
            };
          return next.next = next;
        }
      }
      return {
        next: doneResult
      };
    }
    function doneResult() {
      return {
        value: undefined,
        done: !0
      };
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), defineProperty(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
      var ctor = "function" == typeof genFun && genFun.constructor;
      return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
    }, exports.mark = function (genFun) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
    }, exports.awrap = function (arg) {
      return {
        __await: arg
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
      return this;
    }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      void 0 === PromiseImpl && (PromiseImpl = Promise);
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
      return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
      return this;
    }), define(Gp, "toString", function () {
      return "[object Generator]";
    }), exports.keys = function (val) {
      var object = Object(val),
        keys = [];
      for (var key in object) keys.push(key);
      return keys.reverse(), function next() {
        for (; keys.length;) {
          var key = keys.pop();
          if (key in object) return next.value = key, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, exports.values = values, Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
      },
      stop: function () {
        this.done = !0;
        var rootRecord = this.tryEntries[0].completion;
        if ("throw" === rootRecord.type) throw rootRecord.arg;
        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) throw exception;
        var context = this;
        function handle(loc, caught) {
          return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
        }
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i],
            record = entry.completion;
          if ("root" === entry.tryLoc) return handle("end");
          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");
            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            } else {
              if (!hasFinally) throw new Error("try statement without catch or finally");
              if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }
        finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
        var record = finallyEntry ? finallyEntry.completion : {};
        return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
      },
      complete: function (record, afterLoc) {
        if ("throw" === record.type) throw record.arg;
        return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
        }
      },
      catch: function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if ("throw" === record.type) {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        return this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
      }
    }, exports;
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  function getTime() {
    var date = new Date();
    return date.getMilliseconds() / 1000.0 + date.getSeconds() + date.getMinutes() * 60.0;
  }
  var time = /*#__PURE__*/function () {
    function time() {
      _classCallCheck(this, time);
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
    _createClass(time, [{
      key: "response",
      value: function response() {
        var curTime = getTime();
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
    }]);
    return time;
  }();
  var Time = new time();

  var inputHandler = /*#__PURE__*/function () {
    function inputHandler() {
      _classCallCheck(this, inputHandler);
      this.mx = 0;
      this.my = 0;
      this.mdx = 0;
      this.mdy = 0;
      this.mdz = 0;
      this.mL = 0;
      this.mR = 0;
      this.wasInput = false;
    }
    _createClass(inputHandler, [{
      key: "handleEvent",
      value: function handleEvent(event) {
        switch (event.type) {
          case "mouseup":
            event.preventDefault();
            if (event.button == 0) this.mL = 0;else this.mR = 0;
            break;
          case "mousedown":
            event.preventDefault();
            if (event.button == 0) this.mL = 1;else this.mR = 1;
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
    }, {
      key: "update",
      value: function update() {
        if (this.wasInput) this.wasInput = false;else this.mdx = 0, this.mdy = 0, this.mdz = 0;
      }
    }, {
      key: "inputsOut",
      value: function inputsOut() {
        console.log([this.mx, this.my, this.mdx, this.mdy].join(" : "));
      }
    }]);
    return inputHandler;
  }();
  var input = new inputHandler();

  var vert$1 = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 in_pos;in vec3 in_norm;out vec3 vs_Pos;out vec3 vs_Norm;out vec4 vs_Color;void main(void){gl_Position=MatrWVP*vec4(in_pos,1.0);vs_Pos=(MatrW*vec4(in_pos,1.0)).xyz;vs_Norm=mat3(MatrW)*in_norm;vs_Color=vec4(0.6,0.8,0.9,1.0);}"; // eslint-disable-line

  var frag = "#version 300 es\nprecision highp float;\n#define GLSLIFY 1\nuniform UBuf{mat4 MatrWVP;mat4 MatrW;vec4 CamPos;};in vec3 vs_Pos;in vec3 vs_Norm;in vec4 vs_Color;out vec4 outColor;void main(void){vec3 L=normalize(vec3(0.0,1.0,0.5));vec3 LC=vec3(1.0);vec3 Ka=vec3(0.1);vec3 Kd=vs_Color.xyz;vec3 Ks=vec3(0.8);float Ph=1.0;vec3 V=normalize(vs_Pos-CamPos.xyz);vec3 color=min(vec3(0.1),Ka);vec3 N=faceforward(vs_Norm,V,vs_Norm);color+=max(0.0,dot(N,L))*Kd*LC;vec3 R=reflect(V,N);color+=pow(max(0.0,dot(R,L)),Ph)*Ks*LC;outColor=vec4(color,1.0);}"; // eslint-disable-line

  var gl, shaderProgram;
  var canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("webgl2");
  function loadShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var buf = gl.getShaderInfoLog(shader);
      console.log("Compiling error:");
      console.log(buf);
    }
    return shader;
  }
  function shaderInit() {
    return new Promise(function (resolve, reject) {
      var vsh = loadShader(gl.VERTEX_SHADER, vert$1);
      var fsh = loadShader(gl.FRAGMENT_SHADER, frag);
      shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vsh);
      gl.attachShader(shaderProgram, fsh);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var Buf = gl.getProgramInfoLog(shaderProgram);
        reject(Buf);
      }
      resolve();
    });
  }

  function mat3determ(a00, a01, a02, a10, a11, a12, a20, a21, a22) {
    return a00 * a11 * a22 + a01 * a12 * a20 + a02 * a10 * a21 - a02 * a11 * a20 - a01 * a10 * a22 - a00 * a12 * a21;
  }
  var pi = 3.14159265358979;
  function D2R(A) {
    return A * (pi / 180.0);
  }
  function R2D(R) {
    return R / pi * 180.0;
  }
  var mat4 = /*#__PURE__*/function () {
    function mat4(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
      _classCallCheck(this, mat4);
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
    _createClass(mat4, [{
      key: "set",
      value: function set(a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33) {
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
    }, {
      key: "matrTranslate",
      value: function matrTranslate(v) {
        return new mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v.x, v.y, v.z, 1);
      }
    }, {
      key: "matrScale",
      value: function matrScale(v) {
        return new mat4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
      }
    }, {
      key: "mulMatr",
      value: function mulMatr(m) {
        var mr = new mat4(0);
        var i, j, k;
        for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
          for (k = 0; k < 4; k++) mr.a[i][j] += this.a[i][k] * m.a[k][j];
        }
        return mr;
      }
    }, {
      key: "matrTranspose",
      value: function matrTranspose() {
        var mr = new mat4(this.a[0][0], this.a[1][0], this.a[2][0], this.a[3][0], this.a[0][1], this.a[1][1], this.a[2][1], this.a[3][1], this.a[0][2], this.a[1][2], this.a[2][2], this.a[3][2], this.a[0][3], this.a[1][3], this.a[2][3], this.a[3][3]);
        return mr;
      }
    }, {
      key: "determ",
      value: function determ() {
        return this.a[0][0] * mat3determ(this.a[1][1], this.a[1][2], this.a[1][3], this.a[2][1], this.a[2][2], this.a[2][3], this.a[3][1], this.a[3][2], this.a[3][3]) - this.a[0][1] * mat3determ(this.a[1][0], this.a[1][2], this.a[1][3], this.a[2][0], this.a[2][2], this.a[2][3], this.a[3][0], this.a[3][2], this.a[3][3]) + this.a[0][2] * mat3determ(this.a[1][0], this.a[1][1], this.a[1][3], this.a[2][0], this.a[2][1], this.a[2][3], this.a[3][0], this.a[3][1], this.a[3][3]) - this.a[0][3] * mat3determ(this.a[1][0], this.a[1][1], this.a[1][2], this.a[2][0], this.a[2][1], this.a[2][2], this.a[3][0], this.a[3][1], this.a[3][2]);
      }
    }, {
      key: "matrView",
      value: function matrView(loc, at, up1) {
        var dir = at.sub(loc).norm();
        var right = dir.cross(up1).norm();
        var up = right.cross(dir);
        return new mat4(right.x, up.x, -dir.x, 0, right.y, up.y, -dir.y, 0, right.z, up.z, -dir.z, 0, -loc.dot(right), -loc.dot(up), loc.dot(dir), 1);
      }
    }, {
      key: "matrFrustrum",
      value: function matrFrustrum(l, r, b, t, n, f) {
        return new mat4(2 * n / (r - l), 0, 0, 0, 0, 2 * n / (t - b), 0, 0, (r + l) / (r - l), (t + b) / (t - b), -(f + n) / (f - n), -1, 0, 0, -2 * n * f / (f - n), 0);
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var b = [];
        for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) b.push(this.a[i][j]);
        return b;
      }
    }, {
      key: "matrRotateX",
      value: function matrRotateX(a) {
        var ra = D2R(a);
        var si = Math.sin(ra),
          co = Math.cos(ra);
        return new mat4(1, 0, 0, 0, 0, co, si, 0, 0, -si, co, 0, 0, 0, 0, 1);
      }
    }, {
      key: "matrRotateY",
      value: function matrRotateY(a) {
        var ra = D2R(a);
        var si = Math.sin(ra),
          co = Math.cos(ra);
        return new mat4(co, 0, -si, 0, 0, 1, 0, 0, si, 0, co, 0, 0, 0, 0, 1);
      }
    }, {
      key: "matrRotateZ",
      value: function matrRotateZ(a) {
        var ra = D2R(a);
        var si = Math.sin(ra),
          co = Math.cos(ra);
        return new mat4(co, si, 0, 0, -si, co, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
    }, {
      key: "rotX",
      value: function rotX(a) {
        return this.set(this.mulMatr(this.matrRotateX(a)));
      }
    }, {
      key: "rotY",
      value: function rotY(a) {
        return this.set(this.mulMatr(this.matrRotateY(a)));
      }
    }, {
      key: "rotZ",
      value: function rotZ(a) {
        return this.set(this.mulMatr(this.matrRotateZ(a)));
      }
    }]);
    return mat4;
  }();
  var vec3 = /*#__PURE__*/function () {
    function vec3(x, y, z) {
      _classCallCheck(this, vec3);
      if (x == undefined) this.x = 0, this.y = 0, this.z = 0;else if (typeof x == "object") this.x = x.x, this.y = x.y, this.z = x.z;else if (y == undefined) this.x = x, this.y = x, this.z = x;else this.x = x, this.y = y, this.z = z;
      return this;
    }
    _createClass(vec3, [{
      key: "set",
      value: function set(x, y, z) {
        if (x == undefined) this.x = 0, this.y = 0, this.z = 0;else if (typeof x == "object") this.x = x.x, this.y = x.y, this.z = x.z;else if (y == undefined) this.x = x, this.y = x, this.z = x;else this.x = x, this.y = y, this.z = z;
        return this;
      }
    }, {
      key: "add",
      value: function add(x, y, z) {
        if (typeof x == "object") return new vec3(this.x + x.x, this.y + x.y, this.z + x.z);else if (x != undefined && y != undefined && z != undefined) return new vec3(this.x + x, this.y + y, this.z + z);else if (x != undefined) return new vec3(this.x + x, this.y + x, this.z + x);else return new vec3(this);
      }
    }, {
      key: "sub",
      value: function sub(x, y, z) {
        if (typeof x == "object") return new vec3(this.x - x.x, this.y - x.y, this.z - x.z);else if (x != undefined && y != undefined && z != undefined) return new vec3(this.x - x, this.y - y, this.z - z);else if (x != undefined) return new vec3(this.x - x, this.y - x, this.z - x);else return new vec3(this);
      }
    }, {
      key: "mulNum",
      value: function mulNum(n) {
        if (n == undefined || typeof n != "number") return new vec3(this);else return new vec3(this.x * n, this.y * n, this.z * n);
      }
    }, {
      key: "divNum",
      value: function divNum(n) {
        if (n == undefined || typeof n != "number") return new vec3(this);else return new vec3(this.x / n, this.y / n, this.z / n);
      }
    }, {
      key: "neg",
      value: function neg() {
        return new vec3(-this.x, -this.y, -this.z);
      }
    }, {
      key: "dot",
      value: function dot(x, y, z) {
        if (typeof x == "object") return this.x * x.x + this.y * x.y + this.z * x.z;else if (x != undefined && y != undefined && z != undefined) return this.x * x + this.y * y + this.z * z;else if (x != undefined) return this.x * x + this.y * x + this.z * x;else return this;
      }
    }, {
      key: "cross",
      value: function cross(x, y, z) {
        if (typeof x == "object") return new vec3(this.y * x.z - this.z * x.y, this.z * x.x - this.x * x.z, this.x * x.y - this.y * x.x);else if (x != undefined && y != undefined && z != undefined) return new vec3(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x);else if (x != undefined) return new vec3(this.y * x - this.z * x, this.z * x - this.x * x, this.x * x - this.y * x);else return new vec3(0);
      }
    }, {
      key: "len2",
      value: function len2() {
        return this.dot(this);
      }
    }, {
      key: "len",
      value: function len() {
        return Math.sqrt(this.dot(this));
      }
    }, {
      key: "norm",
      value: function norm() {
        var len2 = this.dot(this);
        if (len2 == 1 || len2 == 0) return this;else return this.divNum(Math.sqrt(len2));
      }
    }, {
      key: "pointTransfrom",
      value: function pointTransfrom(m) {
        return new vec3(this.x * m.a[0][0] + this.y * m.a[1][0] + this.z * m.a[2][0] + 1 * m.a[3][0], this.x * m.a[0][1] + this.y * m.a[1][1] + this.z * m.a[2][1] + 1 * m.a[3][1], this.x * m.a[0][2] + this.y * m.a[1][2] + this.z * m.a[2][2] + 1 * m.a[3][2]);
      }
    }]);
    return vec3;
  }();
  var cam = /*#__PURE__*/function () {
    function cam(loc, at, up) {
      var _this = this;
      _classCallCheck(this, cam);
      _defineProperty(this, "configMatr", function () {
        var rx = _this.projSize,
          ry = _this.projSize;
        if (gl.canvas.width > gl.canvas.height) rx *= gl.canvas.width / gl.canvas.height;else ry *= gl.canvas.height / gl.canvas.width;
        _this.matrV = _this.matrV.matrView(_this.loc, _this.at, _this.up);
        _this.matrP = _this.matrP.matrFrustrum(-rx / 2, rx / 2, -ry / 2, ry / 2, _this.projDist, _this.projFarClip);
        _this.matrVP = _this.matrV.mulMatr(_this.matrP);
      });
      if (loc != undefined) this.loc = new vec3(loc);else this.loc = new vec3(0, 0, 10);
      if (at != undefined) this.at = new vec3(at);else this.at = new vec3(0);
      if (up != undefined) this.up = new vec3(up);else this.up = new vec3(0, 1, 0);
      this.matrV = new mat4();
      this.matrP = new mat4();
      this.matrVP = new mat4();
      this.projDist = 1;
      this.projSize = 1;
      this.projFarClip = 3000000;
      this.configMatr();
    }
    _createClass(cam, [{
      key: "set",
      value: function set(loc, at, up) {
        if (loc != undefined) this.loc.set(loc);else this.loc.set(0, 0, 10);
        if (at != undefined) this.at.set(at);else this.at.set(0);
        if (up != undefined) this.up.set(up);else this.up.set(0, 1, 0);
        this.configMatr();
      }
    }, {
      key: "move",
      value: function move() {
        var dist, cosT, sinT, plen, cosP, sinP, azimuth, elevator;
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
          var Wp, Hp, sx, sy, dv;
          Wp = this.projSize;
          Hp = this.projSize;
          if (gl.canvas.width > gl.canvas.height) Wp *= gl.canvas.width / gl.canvas.height;else Hp *= gl.canvas.height / gl.canvas.width;
          sx = -1 * input.mdx * Wp / gl.canvas.width * dist / this.projDist;
          sy = -1 * input.mdy * Hp / gl.canvas.height * dist / this.projDist;
          var dir = this.at.sub(this.loc).norm();
          var right = dir.cross(this.up).norm();
          var up1 = dir.cross(right);
          dv = right.mulNum(sx).add(up1.mulNum(sy));
          this.at = this.at.add(dv);
          this.loc = this.loc.add(dv);
        }
        var vec = new vec3(0, dist, 0);
        var matr = new mat4();
        this.set(vec.pointTransfrom(matr.matrRotateX(elevator).mulMatr(matr.matrRotateY(azimuth)).mulMatr(matr.matrTranslate(this.at))), this.at, this.up);
      }
    }]);
    return cam;
  }();
  var camera = new cam(new vec3(1.5, 5, 14), new vec3(1.5, 0, 0), new vec3(0, 1, 0));

  var matrW = new mat4();

  var MatrBuf = gl.createBuffer();
  var vert = /*#__PURE__*/_createClass(function vert(P, N) {
    _classCallCheck(this, vert);
    this.P = new vec3(P);
    if (N == undefined) this.N = new vec3(0);else this.N = new vec3(N);
  });
  var prim = /*#__PURE__*/function () {
    function prim(V, I) {
      _classCallCheck(this, prim);
      this.V = V;
      this.I = I;
      this.VBuf = gl.createBuffer();
      this.IBuf = gl.createBuffer();
      this.VA = gl.createVertexArray();
      this.NumOfElem = 0;
      this.matrTrans = new mat4();
    }
    _createClass(prim, [{
      key: "createNorms",
      value: function createNorms() {
        for (var i = 0; i < this.V.length; i++) this.V[i].N.set(0);
        for (var _i = 0; _i < this.I.length; _i += 3) {
          var p0 = new vec3(this.V[this.I[_i]].P);
          var p1 = new vec3(this.V[this.I[_i + 1]].P);
          var p2 = new vec3(this.V[this.I[_i + 2]].P);
          var n = p1.sub(p0).cross(p2.sub(p0)).norm();
          this.V[this.I[_i]].N = this.V[this.I[_i]].N.add(n);
          this.V[this.I[_i + 1]].N = this.V[this.I[_i + 1]].N.add(n);
          this.V[this.I[_i + 2]].N = this.V[this.I[_i + 2]].N.add(n);
        }
        for (var _i2 = 0; _i2 < this.V.length; _i2++) this.V[_i2].N.norm();
      }
    }, {
      key: "createBuffers",
      value: function createBuffers() {
        var posBuf = [];
        var _iterator = _createForOfIteratorHelper(this.V),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var elem = _step.value;
            posBuf.push(elem.P.x);
            posBuf.push(elem.P.y);
            posBuf.push(elem.P.z);
            posBuf.push(elem.N.x);
            posBuf.push(elem.N.y);
            posBuf.push(elem.N.z);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBuf);
        gl.bufferData(gl.ARRAY_BUFFER, 4 * posBuf.length, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(posBuf), 0);
        gl.bindVertexArray(this.VA);
        var posLoc = gl.getAttribLocation(shaderProgram, "in_pos");
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 6 * 4, 0);
        var normLoc = gl.getAttribLocation(shaderProgram, "in_norm");
        gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
        gl.enableVertexAttribArray(posLoc);
        gl.enableVertexAttribArray(normLoc);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 4 * this.I.length, gl.STATIC_DRAW);
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, 0, new Uint32Array(this.I), 0);
        this.NumOfElem = this.I.length;
        return this;
      }
    }, {
      key: "draw",
      value: function draw() {
        var matrWTr = this.matrTrans.mulMatr(matrW);
        var matrWVP = this.matrTrans.mulMatr(matrW).mulMatr(camera.matrVP);
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.UNIFORM_BUFFER, MatrBuf);
        gl.bufferData(gl.UNIFORM_BUFFER, 4 * 16 * 2 + 4 * 4, gl.STATIC_DRAW);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(matrWVP.toArray()), 0);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16, new Float32Array(matrWTr.toArray()), 0);
        gl.bufferSubData(gl.UNIFORM_BUFFER, 4 * 16 * 2, new Float32Array([camera.loc.x, camera.loc.y, camera.loc.z, 1]), 0);
        var bufPos = gl.getUniformBlockIndex(shaderProgram, "UBuf");
        gl.uniformBlockBinding(shaderProgram, bufPos, 0);
        gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, MatrBuf);
        gl.bindVertexArray(this.VA);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBuf);
        gl.drawElements(gl.TRIANGLES, this.NumOfElem, gl.UNSIGNED_INT, this.IBuf);
      }
    }]);
    return prim;
  }();
  function vertRefToTrg(Vref, Iref, Vtrg, Itrg) {
    for (var i = 0; i < Iref.length; i++) {
      Itrg.push(i);
      Vtrg.push(new vert(new vec3(Vref[Iref[i]].P.x, Vref[Iref[i]].P.y, Vref[Iref[i]].P.z)));
    }
  }

  var tetra = /*#__PURE__*/function () {
    function tetra(size, pos, doesRotate) {
      _classCallCheck(this, tetra);
      var Vref = [
      // front
      new vert(new vec3(0, -(size * Math.sqrt(6) / 9), -size / 3 * Math.sqrt(3))),
      // left back
      new vert(new vec3(size * -0.5, -(size * Math.sqrt(6) / 9), size / 6 * Math.sqrt(3))),
      // right back
      new vert(new vec3(size * 0.5, -(size * Math.sqrt(6) / 9), size / 6 * Math.sqrt(3))),
      // top
      new vert(new vec3(0, size / 3 * Math.sqrt(6) - size * Math.sqrt(6) / 9, 0))];
      var Iref = [0, 1, 2, 0, 1, 3, 0, 2, 3, 1, 2, 3];
      var V = [],
        I = [];
      vertRefToTrg(Vref, Iref, V, I);
      this.Pr = new prim(V, I);
      this.Pr.createNorms();
      this.Pr.createBuffers();
      if (pos != undefined) this.pos = pos;else this.pos = new vec3(0);
      if (doesRotate == undefined) this.doesRotate = true;else this.doesRotate = doesRotate;
      this.angle = 0;
      this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
    }
    _createClass(tetra, [{
      key: "draw",
      value: function draw() {
        this.Pr.draw();
      }
    }, {
      key: "response",
      value: function response() {
        if (this.doesRotate == true) {
          this.angle += Time.localDelta * 180;
          var matr = new mat4();
          this.Pr.matrTrans = matr.matrRotateY(this.angle).rotX(this.angle).mulMatr(matr.matrTranslate(this.pos));
        }
      }
    }]);
    return tetra;
  }();

  var octa = /*#__PURE__*/function () {
    function octa(size, pos, doesRotate) {
      _classCallCheck(this, octa);
      var Vref = [new vert(new vec3(-size / 2, 0, -size / 2)),
      // 0
      new vert(new vec3(-size / 2, 0, size / 2)),
      // 1
      new vert(new vec3(size / 2, 0, size / 2)),
      // 2
      new vert(new vec3(size / 2, 0, -size / 2)),
      // 3
      new vert(new vec3(0, size / Math.sqrt(2), 0)),
      // 4
      new vert(new vec3(0, -size / Math.sqrt(2), 0)) // 5
      ];

      var Iref = [0, 1, 4, 1, 2, 4, 2, 3, 4, 0, 3, 4, 0, 1, 5, 1, 2, 5, 2, 3, 5, 0, 3, 5];
      var V = [],
        I = [];
      vertRefToTrg(Vref, Iref, V, I);
      this.Pr = new prim(V, I);
      this.Pr.createNorms();
      this.Pr.createBuffers();
      if (pos != undefined) this.pos = pos;else this.pos = new vec3(0);
      if (doesRotate == undefined) this.doesRotate = true;else this.doesRotate = doesRotate;
      this.angle = 0;
      this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
    }
    _createClass(octa, [{
      key: "draw",
      value: function draw() {
        this.Pr.draw();
      }
    }, {
      key: "response",
      value: function response() {
        if (this.doesRotate == true) {
          this.angle += Time.localDelta * 180;
          var matr = new mat4();
          this.Pr.matrTrans = matr.matrRotateY(this.angle).rotX(this.angle).mulMatr(matr.matrTranslate(this.pos));
        }
      }
    }]);
    return octa;
  }();

  var cube = /*#__PURE__*/function () {
    function cube(size, pos, doesRotate) {
      _classCallCheck(this, cube);
      var Vref = [new vert(new vec3(-size / 2, -size / 2, -size / 2)),
      // 0
      new vert(new vec3(-size / 2, size / 2, -size / 2)),
      // 1
      new vert(new vec3(size / 2, size / 2, -size / 2)),
      // 2
      new vert(new vec3(size / 2, -size / 2, -size / 2)),
      // 3
      new vert(new vec3(-size / 2, -size / 2, size / 2)),
      // 4
      new vert(new vec3(-size / 2, size / 2, size / 2)),
      // 5
      new vert(new vec3(size / 2, size / 2, size / 2)),
      // 6
      new vert(new vec3(size / 2, -size / 2, size / 2)) // 7
      ];

      var Iref = [0, 1, 2, 0, 3, 2, 0, 1, 5, 0, 4, 5, 4, 5, 6, 4, 7, 6, 3, 2, 6, 3, 7, 6, 0, 4, 7, 0, 3, 7, 1, 2, 6, 1, 5, 6];
      var V = [],
        I = [];
      vertRefToTrg(Vref, Iref, V, I);
      this.Pr = new prim(V, I);
      this.Pr.createNorms();
      this.Pr.createBuffers();
      if (pos != undefined) this.pos = pos;else this.pos = new vec3(0);
      if (doesRotate == undefined) this.doesRotate = true;else this.doesRotate = doesRotate;
      this.angle = 0;
      this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
    }
    _createClass(cube, [{
      key: "draw",
      value: function draw() {
        this.Pr.draw();
      }
    }, {
      key: "response",
      value: function response() {
        if (this.doesRotate == true) {
          this.angle += Time.localDelta * 180;
          var matr = new mat4();
          this.Pr.matrTrans = matr.matrRotateY(this.angle).rotX(this.angle).mulMatr(matr.matrTranslate(this.pos));
        }
      }
    }]);
    return cube;
  }();

  var dodeca = /*#__PURE__*/function () {
    function dodeca(size, pos, doesRotate) {
      _classCallCheck(this, dodeca);
      var R = size / 4 * (1 + Math.sqrt(5)) * Math.sqrt(3);
      var r1 = size * Math.sqrt(5 + Math.sqrt(5)) / Math.sqrt(10);
      var r2 = r1 * (Math.sqrt(5) + 1) / 2;
      var h1 = Math.sqrt(R * R - r1 * r1);
      var h2 = Math.sqrt(R * R - r2 * r2);
      var Vref = [
      // top pentagon
      new vert(new vec3(r1 * Math.cos(D2R(0)), h1, r1 * Math.sin(D2R(0)))),
      // 0
      new vert(new vec3(r1 * Math.cos(D2R(72)), h1, r1 * Math.sin(D2R(72)))),
      // 1
      new vert(new vec3(r1 * Math.cos(D2R(144)), h1, r1 * Math.sin(D2R(144)))),
      // 2
      new vert(new vec3(r1 * Math.cos(D2R(216)), h1, r1 * Math.sin(D2R(216)))),
      // 3
      new vert(new vec3(r1 * Math.cos(D2R(288)), h1, r1 * Math.sin(D2R(288)))),
      // 4
      // bottom pentagon
      new vert(new vec3(r1 * Math.cos(D2R(0 + 36)), -h1, r1 * Math.sin(D2R(0 + 36)))),
      // 5
      new vert(new vec3(r1 * Math.cos(D2R(72 + 36)), -h1, r1 * Math.sin(D2R(72 + 36)))),
      // 6
      new vert(new vec3(r1 * Math.cos(D2R(144 + 36)), -h1, r1 * Math.sin(D2R(144 + 36)))),
      // 7
      new vert(new vec3(r1 * Math.cos(D2R(216 + 36)), -h1, r1 * Math.sin(D2R(216 + 36)))),
      // 8
      new vert(new vec3(r1 * Math.cos(D2R(288 + 36)), -h1, r1 * Math.sin(D2R(288 + 36)))),
      // 9
      // upper middle rim
      new vert(new vec3(r2 * Math.cos(D2R(0)), h2, r2 * Math.sin(D2R(0)))),
      // 10
      new vert(new vec3(r2 * Math.cos(D2R(72)), h2, r2 * Math.sin(D2R(72)))),
      // 11
      new vert(new vec3(r2 * Math.cos(D2R(144)), h2, r2 * Math.sin(D2R(144)))),
      // 12
      new vert(new vec3(r2 * Math.cos(D2R(216)), h2, r2 * Math.sin(D2R(216)))),
      // 13
      new vert(new vec3(r2 * Math.cos(D2R(288)), h2, r2 * Math.sin(D2R(288)))),
      // 14
      // bottom middle rim
      new vert(new vec3(r2 * Math.cos(D2R(0 + 36)), -h2, r2 * Math.sin(D2R(0 + 36)))),
      // 15
      new vert(new vec3(r2 * Math.cos(D2R(72 + 36)), -h2, r2 * Math.sin(D2R(72 + 36)))),
      // 16
      new vert(new vec3(r2 * Math.cos(D2R(144 + 36)), -h2, r2 * Math.sin(D2R(144 + 36)))),
      // 17
      new vert(new vec3(r2 * Math.cos(D2R(216 + 36)), -h2, r2 * Math.sin(D2R(216 + 36)))),
      // 18
      new vert(new vec3(r2 * Math.cos(D2R(288 + 36)), -h2, r2 * Math.sin(D2R(288 + 36)))) // 19
      ];

      var Iref = [
      // top pentagon
      0, 1, 2, 0, 2, 3, 0, 3, 4,
      // bottom pentagon
      5, 6, 7, 5, 7, 8, 5, 8, 9,
      // upper middle pentagons
      // 1
      0, 1, 11, 0, 11, 15, 0, 15, 10,
      // 2
      1, 2, 12, 1, 12, 16, 1, 16, 11,
      // 3
      2, 3, 13, 2, 13, 17, 2, 17, 12,
      // 4
      3, 4, 14, 3, 14, 18, 3, 18, 13,
      // 5
      4, 0, 10, 4, 10, 19, 4, 19, 14,
      // lower middle pentagons
      // 1
      5, 6, 16, 5, 16, 11, 5, 11, 15,
      // 2
      6, 7, 17, 6, 17, 12, 6, 12, 16,
      // 3
      7, 8, 18, 7, 18, 13, 7, 13, 17,
      // 4
      8, 9, 19, 8, 19, 14, 8, 14, 18,
      // 5
      9, 5, 15, 9, 15, 10, 9, 10, 19];
      var V = [],
        I = [];
      vertRefToTrg(Vref, Iref, V, I);
      this.Pr = new prim(V, I);
      this.Pr.createNorms();
      this.Pr.createBuffers();
      if (pos != undefined) this.pos = pos;else this.pos = new vec3(0);
      if (doesRotate == undefined) this.doesRotate = true;else this.doesRotate = doesRotate;
      this.angle = 0;
      this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
    }
    _createClass(dodeca, [{
      key: "draw",
      value: function draw() {
        this.Pr.draw();
      }
    }, {
      key: "response",
      value: function response() {
        if (this.doesRotate == true) {
          this.angle += Time.localDelta * 180;
          var matr = new mat4();
          this.Pr.matrTrans = matr.matrRotateY(this.angle).rotX(this.angle).mulMatr(matr.matrTranslate(this.pos));
        }
      }
    }]);
    return dodeca;
  }();

  var icoso = /*#__PURE__*/function () {
    function icoso(size, pos, doesRotate) {
      _classCallCheck(this, icoso);
      var r = size * Math.sqrt(5 + Math.sqrt(5)) / Math.sqrt(10);
      var h = Math.sqrt(3 / 4 * size * size - r * r * (1 - Math.cos(D2R(36))) * (1 - Math.cos(D2R(36)))) / 2;
      var c = Math.sqrt(size * size - r * r);
      var Vref = [new vert(new vec3(0, h + c, 0)),
      // 0
      new vert(new vec3(0, -h - c, 0)),
      // 1
      new vert(new vec3(r * Math.cos(D2R(0)), h, r * Math.sin(D2R(0)))),
      // 2
      new vert(new vec3(r * Math.cos(D2R(72)), h, r * Math.sin(D2R(72)))),
      // 3
      new vert(new vec3(r * Math.cos(D2R(144)), h, r * Math.sin(D2R(144)))),
      // 4
      new vert(new vec3(r * Math.cos(D2R(216)), h, r * Math.sin(D2R(216)))),
      // 5
      new vert(new vec3(r * Math.cos(D2R(288)), h, r * Math.sin(D2R(288)))),
      // 6
      new vert(new vec3(r * Math.cos(D2R(0 + 36)), -h, r * Math.sin(D2R(0 + 36)))),
      // 2
      new vert(new vec3(r * Math.cos(D2R(72 + 36)), -h, r * Math.sin(D2R(72 + 36)))),
      // 3
      new vert(new vec3(r * Math.cos(D2R(144 + 36)), -h, r * Math.sin(D2R(144 + 36)))),
      // 4
      new vert(new vec3(r * Math.cos(D2R(216 + 36)), -h, r * Math.sin(D2R(216 + 36)))),
      // 5
      new vert(new vec3(r * Math.cos(D2R(288 + 36)), -h, r * Math.sin(D2R(288 + 36)))) // 6
      ];

      var Iref = [
      // top cap
      2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 2, 0,
      // middle
      2, 3, 7, 7, 8, 3, 3, 4, 8, 8, 9, 4, 4, 5, 9, 9, 10, 5, 5, 6, 10, 10, 11, 6, 6, 2, 11, 11, 7, 2,
      // bottom cap
      7, 8, 1, 8, 9, 1, 9, 10, 1, 10, 11, 1, 11, 7, 1];
      var V = [],
        I = [];
      vertRefToTrg(Vref, Iref, V, I);
      this.Pr = new prim(V, I);
      this.Pr.createNorms();
      this.Pr.createBuffers();
      if (pos != undefined) this.pos = pos;else this.pos = new vec3(0);
      if (doesRotate == undefined) this.doesRotate = true;else this.doesRotate = doesRotate;
      this.angle = 0;
      this.Pr.matrTrans = this.Pr.matrTrans.matrTranslate(this.pos);
    }
    _createClass(icoso, [{
      key: "draw",
      value: function draw() {
        this.Pr.draw();
      }
    }, {
      key: "response",
      value: function response() {
        if (this.doesRotate == true) {
          this.angle += Time.localDelta * 180;
          var matr = new mat4();
          this.Pr.matrTrans = matr.matrRotateY(this.angle).rotX(this.angle).mulMatr(matr.matrTranslate(this.pos));
        }
      }
    }]);
    return icoso;
  }();

  var Scene = [];
  function GLInit() {
    return _GLInit.apply(this, arguments);
  }
  function _GLInit() {
    _GLInit = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              shaderInit().then(function () {
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
              }).catch(function (err) {
                reject(err);
              });
            }));
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _GLInit.apply(this, arguments);
  }
  function cycle() {
    gl.clearColor(0.2, 0.47, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    input.update();
    Time.response();
    camera.move();
    var _iterator = _createForOfIteratorHelper(Scene),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var elem = _step.value;
        if (elem.response != undefined) elem.response();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(Scene),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _elem = _step2.value;
        if (_elem.draw != undefined) _elem.draw();
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    window.requestAnimationFrame(cycle);
  }
  var glCanvas = document.getElementById("glCanvas");
  window.addEventListener("mouseup", function (event) {
    input.handleEvent(event);
  });
  glCanvas.addEventListener("mousedown", function (event) {
    input.handleEvent(event);
  });
  window.addEventListener("mousemove", function (event) {
    input.handleEvent(event);
  });
  glCanvas.addEventListener("wheel", function (event) {
    input.handleEvent(event);
  });
  function main() {
    var init = GLInit();
    init.then(function () {
      cycle();
    }).catch(function (err) {
      console.log(err);
    });
  }
  window.addEventListener("load", main);

})();
