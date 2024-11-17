class Predator {
  constructor(posX, posY) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.vision = 120;
    this.size = 40;
    this.speed = 2;
    this.direction = createVector(random(-1, 1), random(-1, 1)).normalize();
  }

  draw(img) {
    // vision représenté par un cercle sombre
    fill(0, 0, 0, 150);
    ellipse(this.coordinate.x, this.coordinate.y, this.vision * 2);

    // image de notre crapaud
    image(
      img,
      this.coordinate.x - img.width / 2,
      this.coordinate.y - img.width / 2
    );
  }

  detectInsect(insectX, insectY) {
    let distance = dist(this.coordinate.x, this.coordinate.y, insectX, insectY);
    return distance < this.vision;
  }

  move() {
    // mise à jour de la position
    this.coordinate.x += this.direction.x * this.speed;
    this.coordinate.y += this.direction.y * this.speed;

    // gestion des collisions avec les bords
    if (
      this.coordinate.x - this.size / 2 < 0 ||
      this.coordinate.x + this.size / 2 > width
    ) {
      this.direction.x *= -1; // on inverse la direction horizontale
    }
    if (
      this.coordinate.y - this.size / 2 < 0 ||
      this.coordinate.y + this.size / 2 > height
    ) {
      this.direction.y *= -1; // on inverse la direction verticale
    }

    // on simule un mouvement aléatoire pour être imprévisible
    this.direction.x += random(-0.1, 0.1);
    this.direction.y += random(-0.1, 0.1);
    this.direction.normalize();
  }
}
