
/*
Marie la fourmi, personnage principal du jeu.
Se dirige instinctivement vers les graines (Seed) déposer par le joueur pour les manger (= gain de points)

Prédateurs : humains (jour), crapauds (nuit)
*/

class Marie {

  /*
  Attributs :
  - coordinate : position (x, y) de Marie à l'écran
  - frame : asset graphique représentant Marie la fourmi
  - nightCanvas : plan sur lequel le champ de vision de Marie est dessiné
  - speed : vitesse de déplacement de Marie
  - target : graine vers laquelle Marie est en train de se déplacer (peut être null, dans ce cas là Marie est statique)
  - targetIndex : index de la graine vers laquelle Marie est en train de se déplacer dans le tableau des graines à l'écran (déposées par le joueur et pas encore mangées par Marie)
  - score : score de la partie en cours, augmente quand Marie mange des graines
  - isEating : état de Marie (true si elle est en train de manger une graine, false si elle est train de se déplacer ou en attente d'une cible)
  - progressbar : barre de progression indiquant le temps restant avant que Marie reprenne sa route quand elle est en train de manger
  - direction : direction dans laquelle l'asset de Marie regarde (vers la droite ou vers la gauche)
  - currentAngle : direction dans laquelle Marie est en train de se déplacer, direction de son champ de vision
  */

  constructor(frame, posX, posY, nightCanvas) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.frame = frame;
    this.nightCanvas = nightCanvas;
    this.speed = this.nightCanvas ? 3 : 6;
    this.target = null;
    this.targetIndex = -1;
    this.score = 0;
    this.isEating = false;
    this.progressbar = null;
    this.direction = "toTheRight";
    this.currentAngle = 0;
  }

  startToEat() {
    this.isEating = true;
    this.progressbar = new ProgressBar(this.target.value);
  }

  eat() {
    // On fait avancer la barre de progression
    this.progressbar.draw(this.coordinate.x - 5, this.coordinate.y - 20);
    let bResult = this.progressbar.update();

    // Quand la barre de progression atteint son maximum
    if (bResult) {

      // On modifie le score, on enlève la graine et on nettoie les variables d'états
      this.score += seeds[this.targetIndex].value;
      seeds.splice(this.targetIndex, 1);

      this.isEating = false;
      this.progressbar = null;
      this.targetIndex = -1;
      this.target = null;
    }
  }

  /* Permet à Marie d'arrêter de manger et de poursuivre son chemin directement, sans attendre la fin de la barre de progression
  Dans ce cas, le score n'est pas incrémenté et la graine concernée est "perdue" */
  leakInPanic(seeds) {
    this.isEating = false;
    this.progressbar = null;
    seeds.splice(this.targetIndex, 1);
    this.targetIndex = -1;
    this.target = null;
  }

  // Recherche la graine la plus proche parmi celles affichées à l'écran
  lookForClosestSeed(seeds) {
    let closestSeed = null;
    let minDistance = Infinity;

    seeds.forEach((seed, index) => {
      let d = dist(
          this.coordinate.x,
          this.coordinate.y,
          seed.coordinate.x,
          seed.coordinate.y
      );

      if (d < minDistance) {
        minDistance = d;
        this.targetIndex = index;
        closestSeed = seed;
      }
    });

    this.target = closestSeed;
  }

  // Rapproche Marie de sa cible
  moveTowardTarget() {
    if (!this.target || this.isEating) return;

    let dx = this.target.coordinate.x - this.coordinate.x;
    let dy = this.target.coordinate.y - this.coordinate.y;
    let distance = dist(
        this.coordinate.x,
        this.coordinate.y,
        this.target.coordinate.x,
        this.target.coordinate.y
    );

    if (distance < 10) {
      this.startToEat();
    } else {
      let directionX = dx / distance;
      let directionY = dy / distance;

      this.coordinate.x += directionX * this.speed;
      this.coordinate.y += directionY * this.speed;

      this.currentAngle = atan2(dy, dx);
    }
  }

  // Permet à Marie d'agir en fonction de son état (en train de manger ou pas)
  think(seeds) {
    if (this.isEating) {
      // Si elle n'a pas fini de manger, elle continue
      this.eat();
    } else {
      // Si elle n'est pas en train de manger, elle recherche la graine la plus proche et la prend "pour cible"
      this.lookForClosestSeed(seeds);
    }
  }

  // Dessine le champ de vision de Marie
  drawVision() {
    if (!this.nightCanvas) return;

    this.nightCanvas.erase();
    this.nightCanvas.circle(this.coordinate.x, this.coordinate.y, 80);
    let angle = this.currentAngle;
    this.nightCanvas.push();
    this.nightCanvas.translate(this.coordinate.x, this.coordinate.y);
    this.nightCanvas.rotate(angle);
    this.nightCanvas.circle(40, 0, 100);
    this.nightCanvas.circle(70, 0, 115);
    this.nightCanvas.pop();
    this.nightCanvas.noErase();
  }

  // Dessine Marie
  draw() {
    let direction = this.direction;

    // On détermine la direction dans laquelle Marie est en train de regarder
    if (this.target !== null) {
      if (this.coordinate.x < this.target.coordinate.x) {
        direction = "toTheRight";
      } else {
        direction = "toTheLeft";
      }
    }

    if (direction !== this.direction) {
      this.direction = direction;
    }

    // On dessine Marie
    if (direction === "toTheLeft") {
      image(
          this.frame,
          this.coordinate.x - this.frame.width / 2,
          this.coordinate.y - this.frame.height / 2
      );
    } else {
      push();
      scale(-1, 1);
      image(
          this.frame,
          -this.coordinate.x - this.frame.width / 2,
          this.coordinate.y - this.frame.height / 2
      );
      pop();
    }
  }
}
