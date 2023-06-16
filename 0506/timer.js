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
