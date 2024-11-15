class Marie {
  constructor(posX, posY, pDarkLayer) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.darkLayer = pDarkLayer;
    this.speed = this.darkLayer ? 3 : 6;
    this.target = null;
    this.targetIndex = -1;
    this.score = 0;
    this.isEating = false;
    this.progressbar = null;
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
    }
  }

  eatSeed() {
    this.isEating = true;
    this.progressbar = new ProgressBar(this.target.value);
  }

  draw() {
    if (this.darkLayer === null) {
      fill(255, 0, 0);
      circle(this.coordinate.x, this.coordinate.y, 25);
    } else {
      // Utilisation du mode gomme pour dessiner la vision de Marie en mode nuit
      this.darkLayer.erase();
      this.darkLayer.circle(marie.coordinate.x, marie.coordinate.y, 150);
      this.darkLayer.noErase();

      this.darkLayer.fill(255, 0, 0);
      this.darkLayer.circle(this.coordinate.x, this.coordinate.y, 25);
    }
  }
}
