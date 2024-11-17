class Seed {
  constructor(x, y, value, frame) {
    this.coordinate = {
      x: x,
      y: y,
    };
    this.value = value; // représente le score, mais aussi la taille de l'image de la graine
    this.frame = frame;
    this.angle = Math.random() * 360;
  }

  draw() {
    push();
    translate(this.coordinate.x, this.coordinate.y);
    rotate(radians(this.angle));
    image(this.frame, -this.value / 2, -this.value / 2, this.value, this.value);
    pop();
  }
}
