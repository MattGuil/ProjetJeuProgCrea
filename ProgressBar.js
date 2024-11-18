
/*
Barre de progression apparaissant quand Marie est en train de manger une graine.
Vide => Marie vient d'arriver au niveau de la graine et commence à manger
Pleine => Marie a fini de manger et reprend sa route (vers une autre graine)
*/

class ProgressBar {

  /*
  Attributs :
  - current : niveau de progression à l'instant t (part de 0 et augmente)
  - speed : vitesse de défilement de la barre de progression (dépend de la valeur de l'attribut value de la graine en train d'être mangée)
  - width : longueur de la barre de progression (fixe)
  - height : hauteur de la barre de progression (fixe)
  */

  constructor(seedValue) {
    this.current = 0;
    this.speed = 100 / seedValue;
    this.width = 50;
    this.height = 5;
  }

  // Dessine la barre de progression
  draw(x, y) {
    stroke(0, 0, 0);
    strokeWeight(1);
    fill("white");
    rect(x, y, this.width, this.height);
    fill("lightgreen");
    rect(x, y, (this.current / 100) * this.width, this.height);
    noStroke();
  }

  /* Incrémente le niveau de la barre de progression
  Renvoie true si elle est remplie à 100%, false si elle est en cours de progression */
  update() {
    this.current += this.speed;
    if (this.current >= 100) {
      this.current = 100;
      return true;
    }
    return false;
  }
}
