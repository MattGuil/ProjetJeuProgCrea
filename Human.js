class Human {
  constructor(pX, pY, pFrame, pDarkMode) {
    this.x = pX;
    this.y = pY;
    this.frame = pFrame;
    this.isDarkMode = pDarkMode;
    this.sx = 5;
    this.sy = 5;
  }

  draw() {
    translate(- this.sx / 2, - this.sy / 2);
    image(this.frame, this.x, this.y, this.sx, this.sy);
    translate(this.sx / 2, this.sy / 2);

    this.sx++;
    this.sy++;
  }

  detectInsect(insectX, insectY) {
    let left = this.x - this.sx / 2;
    let right = this.x + this.sx / 2;
    let top = this.y - this.sy / 2;
    let bottom = this.y + this.sy / 2;

    if (insectX >= left && insectX <= right && insectY >= top && insectY <= bottom) {
      return true;
    }
    return false;
  }
}
