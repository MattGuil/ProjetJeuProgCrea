class Predator {
  constructor(posX, posY) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.vision = 60;
    this.size = 40;
    this.speed = 2;
    this.direction = createVector(random(-1, 1), random(-1, 1)).normalize();
  }

  draw() {
    // Halo sombre semi-transparent
    fill(0, 0, 0, 150);
    ellipse(this.coordinate.x, this.coordinate.y, this.vision * 2);

    // notre grenouille
    fill(34, 139, 34);
    ellipse(this.coordinate.x, this.coordinate.y, this.size);
  }

  detectInsect(insectX, insectY) {
    let distance = dist(this.coordinate.x, this.coordinate.y, insectX, insectY);
    return distance < this.vision;
  }

  move() {
    // Mise à jour de la position
    this.coordinate.x += this.direction.x * this.speed;
    this.coordinate.y += this.direction.y * this.speed;

    // Gestion des collisions avec les bords
    if (
      this.coordinate.x - this.size / 2 < 0 ||
      this.coordinate.x + this.size / 2 > width
    ) {
      this.direction.x *= -1; // Inverser la direction horizontale
    }
    if (
      this.coordinate.y - this.size / 2 < 0 ||
      this.coordinate.y + this.size / 2 > height
    ) {
      this.direction.y *= -1; // Inverser la direction verticale
    }

    // Variation aléatoire de la direction pour simuler un mouvement erratique
    this.direction.x += random(-0.1, 0.1);
    this.direction.y += random(-0.1, 0.1);

    // Re-normalisation pour garder une vitesse constante
    this.direction.normalize();
  }
}
