class Human {
  constructor(pX, pY, pFrame) {
    this.x = pX;
    this.y = pY;
    this.frame = pFrame;
    this.hWidth = 5;
    this.hHeight = 5;
  }

  draw() {
    translate(-this.hWidth / 2, -this.hHeight / 2);
    image(this.frame, this.x, this.y, this.hWidth, this.hHeight);
    translate(this.hWidth / 2, this.hHeight / 2);

    this.hWidth++;
    this.hHeight++;
  }

  detectInsect(insectX, insectY) {
    let left = this.x - this.hWidth / 2;
    let right = this.x + this.hWidth / 2;
    let top = this.y - this.hHeight / 2;
    let bottom = this.y + this.hHeight / 2;

    // Ajustement approximatif (15) pour la collision car l'image n'est pas parfaite
    if (
      insectX >= left + 15 &&
      insectX <= right - 15 &&
      insectY >= top - 15 &&
      insectY <= bottom - 15
    ) {
      return true;
    }
    return false;
  }
}
