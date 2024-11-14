class Human {
  constructor(pX, pY) {
    this.x = pX;
    this.y = pY;
    this.diameter = 20;
    this.figure = random(0, 2); // TODO : ajuster pour avoir le pied, une main, ou autre forme...
  }

  draw() {
    fill(0, 0, 0);
    circle(this.x, this.y, this.diameter);
    this.diameter += 2;
  }

  detectInsect(insectX, insectY) {
    if (
      this.x - this.diameter / 2 <= insectX &&
      insectX <= this.x + this.diameter / 2
    ) {
      if (
        this.y - this.diameter / 2 <= insectY &&
        insectY <= this.y + this.diameter / 2
      ) {
        return true;
      }
    }
    return false;
  }
}
