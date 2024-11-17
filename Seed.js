class Seed {
  constructor(x, y, value) {
    this.coordinate = {
      x: x,
      y: y,
    };
    this.value = value;
  }

  draw(img) {
    fill("yellow");
    circle(this.coordinate.x, this.coordinate.y, this.value);
  }
}
