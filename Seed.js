class Seed {
  constructor(x, y, value) {
    this.coordinate = {
      x: x,
      y: y,
    };
    this.value = value;
  }

  draw() {
    fill("white");
    circle(this.coordinate.x, this.coordinate.y, this.value);
  }
}
