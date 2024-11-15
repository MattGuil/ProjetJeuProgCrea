class ProgressBar {
  constructor(seedValue) {
    this.current = 0;
    this.speed = 100 / seedValue;
    this.width = 50;
    this.height = 5;
  }

  draw(x, y) {
    fill("white");
    rect(x, y, this.width, this.height);
    fill("lightgreen");
    rect(x, y, (this.current / 100) * this.width, this.height);
  }

  update() {
    this.current += this.speed;
    if (this.current >= 100) {
      this.current = 100;
      return true;
    }
    return false;
  }
}
