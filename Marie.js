class Marie {
  constructor(posX, posY) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.speed = 5;
    this.target = null;
    this.targetIndex = -1;
    this.score = 0;
    this.isEating = false;
    this.progressbar = null;
  }

  lookForClosestSeed(seeds) {
    if (this.isEating) {
      this.progressbar.draw(this.coordinate.x - 5, this.coordinate.y - 20);
      let bRes = this.progressbar.update();
      if (bRes) {
        console.log("a fini de mangé");
        this.score += seeds[this.targetIndex].value;

        seeds.splice(this.targetIndex, 1);

        // Réinitialise les états
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
    this.progressbar = new Progressbar(this.target.value);
  }

  draw() {
    fill(255, 0, 0);
    circle(this.coordinate.x, this.coordinate.y, 25);
  }
}
