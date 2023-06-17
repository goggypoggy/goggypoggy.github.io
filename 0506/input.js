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

export let input = new inputHandler();
