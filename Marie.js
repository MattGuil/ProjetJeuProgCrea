class Marie {
  constructor(frame, posX, posY, pDarkLayer) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.frame = frame;
    this.darkLayer = pDarkLayer;
    this.speed = this.darkLayer ? 3 : 6;
    this.target = null;
    this.targetIndex = -1;
    this.score = 0;
    this.isEating = false;
    this.progressbar = null;

    // Angle actuel de direction, par défaut vers le haut (0 radians)
    this.currentAngle = 0;
  }

  leakInPanic(seeds) {
    // Fuite en panique face à un ennemi/crapaud en approche
    this.isEating = false;
    this.progressbar = null;
    seeds.splice(this.targetIndex, 1);
    this.targetIndex = -1;
    this.target = null;
  }

  lookForClosestSeed(seeds) {
    if (this.isEating) {
      this.progressbar.draw(this.coordinate.x - 5, this.coordinate.y - 20);
      let bResult = this.progressbar.update();
      if (bResult) {
        // On modifie le score, on enlève la graine et on nettoie les variables d'états
        this.score += seeds[this.targetIndex].value;
        seeds.splice(this.targetIndex, 1);

        this.isEating = false;
        this.progressbar = null;
        this.targetIndex = -1;
        this.target = null;
      }
      return;
    }

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
      this.eatSeed();
    } else {
      let directionX = dx / distance;
      let directionY = dy / distance;

      this.coordinate.x += directionX * this.speed;
      this.coordinate.y += directionY * this.speed;

      // Met à jour l'angle actuel de déplacement
      this.currentAngle = atan2(dy, dx);
    }
  }

  eatSeed() {
    this.isEating = true;
    this.progressbar = new ProgressBar(this.target.value);
    // Conserve l'angle actuel après avoir mangé une graine
  }

  draw(direction) {
    if (this.darkLayer === null) {
      if (direction === "toTheLeft") {
        image(this.frame, this.coordinate.x - this.frame.width / 2, this.coordinate.y - this.frame.height / 2);
      } else {
        push();
        scale(-1, 1);
        image(this.frame, -this.coordinate.x - this.frame.width / 2, this.coordinate.y - this.frame.height / 2);
        pop();
      }
    } else {
      // Utilisation du mode gomme pour dessiner la vision de Marie en mode nuit
      this.darkLayer.erase();
      this.darkLayer.fill(255, 0, 255);
      this.darkLayer.circle(marie.coordinate.x, marie.coordinate.y, 80);

      let angle = this.currentAngle; // Utilise l'angle actuel

      this.darkLayer.push();
      this.darkLayer.translate(this.coordinate.x, this.coordinate.y);
      this.darkLayer.rotate(angle);
      this.darkLayer.circle(40, 0, 100);
      this.darkLayer.circle(70, 0, 115);
      this.darkLayer.pop();

      this.darkLayer.noErase();

      this.darkLayer.fill(255, 0, 0);
      // this.darkLayer.circle(this.coordinate.x, this.coordinate.y, 25);
      if (direction === "toTheLeft") {
        this.darkLayer.image(this.frame, this.coordinate.x - this.frame.width / 2, this.coordinate.y - this.frame.height / 2);
      } else {
        this.darkLayer.push();
        this.darkLayer.scale(-1, 1);
        this.darkLayer.image(this.frame, -this.coordinate.x - this.frame.width / 2, this.coordinate.y - this.frame.height / 2);
        this.darkLayer.pop();
      }
    }
  }

}
