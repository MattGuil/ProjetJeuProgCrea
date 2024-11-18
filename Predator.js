
/*
Crapaud, prédateur de Marie la nuit.
*/

class Predator {

  /*
  Attributs:
  - coordinate : position (x, y) du crapaud
  - frame : asset graphique représentant le crapaud
  - vision : diamètre du champ de vision du crapaud
  - size: taille du crapaud
  - speed : vitesse de déplacement du crapaud
  - direction : direction dans laquelle le crapaud est en train de se déplacer
  */

  constructor(posX, posY, frame) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.frame = frame;
    this.vision = 120;
    this.size = 40;
    this.speed = 2;
    this.direction = createVector(random(-1, 1), random(-1, 1)).normalize();
  }

  // Dessine le crapaud et son champ de vision
  draw() {
    // Champ de vision
    fill(0, 0, 0, 150);
    ellipse(this.coordinate.x, this.coordinate.y, this.vision * 2);

    // Crapaud
    image(
      this.frame,
      this.coordinate.x - this.frame.width / 2,
      this.coordinate.y - this.frame.width / 2
    );
  }

  // Détecte une éventuelle collision avec les coordonnées de Marie la fourmi qui sont passées en paramètres
  detectInsect(insectX, insectY) {
    let distance = dist(this.coordinate.x, this.coordinate.y, insectX, insectY);
    return distance < this.vision;
  }

  // Met le crapaud en mouvement
  move() {

    // Mise à jour de la position
    this.coordinate.x += this.direction.x * this.speed;
    this.coordinate.y += this.direction.y * this.speed;

    // Gestion des collisions avec les bords de l'écran
    if (
      this.coordinate.x - this.size / 2 < 0 ||
      this.coordinate.x + this.size / 2 > width
    ) {
      this.direction.x *= -1; // On inverse la direction horizontale
    }
    if (
      this.coordinate.y - this.size / 2 < 0 ||
      this.coordinate.y + this.size / 2 > height
    ) {
      this.direction.y *= -1; // On inverse la direction verticale
    }

    // On simule un mouvement aléatoire pour que le prédateur soit imprévisible
    this.direction.x += random(-0.1, 0.1);
    this.direction.y += random(-0.1, 0.1);
    this.direction.normalize();
  }
}
