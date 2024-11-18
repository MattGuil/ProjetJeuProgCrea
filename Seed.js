
/*
Graine, alimentation préferée de Marie.
Déposé par le joueur pour lui indiquer le chemin à suivre et gagner des points.
*/

class Seed {

  /*
  Attributs :
  - coordinate : position (x, y) de la graine à l'écran
  - value : à la fois la taille de la graine et le nombre de points qu'elle rapporte au joueur lorsque Marie la mange
  - frame : asset graphique représentant la graine
  - angle : angle d'affichage de la graine (aléatoire pour plus de diversité)
  */

  constructor(x, y, value, frame) {
    this.coordinate = {
      x: x,
      y: y,
    };
    this.value = value; // représente le score, mais aussi la taille de l'image de la graine
    this.frame = frame;
    this.angle = Math.random() * 360;
  }

  // Dessine la graine
  draw() {
    push();
    translate(this.coordinate.x, this.coordinate.y);
    rotate(radians(this.angle));
    image(this.frame, -this.value / 2, -this.value / 2, this.value, this.value);
    pop();
  }
}
