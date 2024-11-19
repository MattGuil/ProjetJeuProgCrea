
/*
Humain, prédateur de Marie le jour.
S'incarne dans une main ou dans un pied.
*/

class Human {

  /*
  Attributs:
  - x : position x de l'humain
  - y : position y de l'humain
  - frame : asset graphique représentant la main ou le pied de l'humain
  - hWidth : largeur du pied ou de la main
  - hHeight: hauteur du pied ou de la main
  */

  constructor(pX, pY, pFrame) {
    this.x = pX;
    this.y = pY;
    this.frame = pFrame;
    this.hWidth = 5;
    this.hHeight = 5;
    this.opacity = 0;
  }

  // Dessine le pied ou la main à l'écran
  draw() {
    translate(-this.hWidth / 2, -this.hHeight / 2);
    push();
    tint(255, 255, 255, this.opacity);
    image(this.frame, this.x, this.y, this.hWidth, this.hHeight);
    pop();
    translate(this.hWidth / 2, this.hHeight / 2);

    // On incrémente la taille du pied ou de la main pour simuler une attaque en approche
    this.hWidth++;
    this.hHeight++;
    this.opacity++;
  }

  // Détecte une éventuelle collision avec les coordonnées de Marie la fourmi qui sont passées en paramètres
  detectInsect(insectX, insectY) {
    let left = this.x - this.hWidth / 2;
    let right = this.x + this.hWidth / 2;
    let top = this.y - this.hHeight / 2;
    let bottom = this.y + this.hHeight / 2;

    // Ajustement approximatif (à 15px près) pour la collision car le dessin de l'image n'est pas parfait
    return insectX >= left + 15 &&
        insectX <= right - 15 &&
        insectY >= top - 15 &&
        insectY <= bottom - 15;
  }
}
