
/*
Luciole, véritable radar à Crapaud pour Marie la fourmi.
Marie peut en libérer à l'infini, par salve de 7 maximum.
*/

class Firefly {

  /*
  Attributs :
  - coordinate : position (x, y) de la luciole à l'écran
  - vision : diamètre de la zone eclairée par la luciole
  - diameter : diamètre de la luciole
  - speed : vitesse de la luciole
  - direction : direction dans laquelle se déplace la luciole
  - nightCanvas : plan sur lequel la luciole est dessinée
  */

  constructor(pX, pY, nightCanvas) {
    this.coordinate = {
      x: pX,
      y: pY,
    };
    this.vision = 80;
    this.diameter = 20;
    this.speed = 2;
    this.direction = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.nightCanvas = nightCanvas;
  }

  // Dessine la luciole
  draw() {
    if (!this.nightCanvas) return;

    this.nightCanvas.fill(255, 255, 255);
    this.nightCanvas.circle(this.coordinate.x, this.coordinate.y, this.diameter);
  }

  // Dessine la zone eclairée par la luciole
  drawVision(canvas) {
    if (!this.nightCanvas) return;

    this.nightCanvas.erase();
    this.nightCanvas.circle(this.coordinate.x, this.coordinate.y, this.vision);
    this.nightCanvas.noErase();
  }

  // Met la luciole en mouvement
  move() {

    // Mise à jour de la position
    this.coordinate.x += this.direction.x * this.speed;
    this.coordinate.y += this.direction.y * this.speed;

    // Mouvement aléatoire
    this.direction.x += random(-0.1, 0.1);
    this.direction.y += random(-0.1, 0.1);
    this.direction.normalize();
  }

  /* Permet de savoir si la luciole est sortie de l'écran de jeu
  Renvoie true si c'est le cas, false sinon */
  isGone() {
    return this.coordinate.x + this.vision / 2 < 0 ||
           this.coordinate.x - this.vision / 2 > width ||
           this.coordinate.y + this.vision / 2 < 0 ||
           this.coordinate.y - this.vision / 2 > height;
  }
}
