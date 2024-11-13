class Progressbar {
  constructor(marie, seedValue) {
    this.current = 0;
    this.speed = seedValue / 10;
  }

  draw(x, y) {
    fill("white");
    rect(x, y, 100, 10);
    fill("lightgreen");
    rect(x, y, this.current, 10);
  }

  update() {
    this.current += this.speed;
    if (this.current > 100) {
      this.current = 100;
      return true;
    }
    return false;
  }
}
