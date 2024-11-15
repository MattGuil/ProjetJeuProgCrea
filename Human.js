// TODO : habillage
class Human {
  constructor(pX, pY, pDarkMode) {
    this.x = pX;
    this.y = pY;
    this.isDarkMode = pDarkMode;
    this.diameter = 20;
  }

  draw() {
    fill(0, 255, 255);
    circle(this.x, this.y, this.diameter);
    this.diameter += this.isDarkMode ? 1 : 3;
  }

  detectInsect(insectX, insectY) {
    // Calcul de la distance entre l'insecte et l'ennemi
    let distX = insectX - this.x;
    let distY = insectY - this.y;
    let distance = Math.sqrt(distX * distX + distY * distY);

    // test collision
    if (distance <= this.diameter / 2) {
      return true;
    }
    return false;
  }
}
