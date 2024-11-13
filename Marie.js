class Marie {
  constructor(posX, posY) {
    this.coordinate = {
      x: posX,
      y: posY,
    };
    this.speed = 5;
    this.target = null;
    this.targetIndex = -1;
  }

  lookForClosestSeed(seeds) {
    let closestSeed = null;
    let minDistance = Infinity;

    seeds.forEach((seed, index) => {
      let d = dist(this.coordinate.x, this.coordinate.y, seed.coordinate.x, seed.coordinate.y);

      if (d < minDistance) {
        minDistance = d;
        this.targetIndex = index;
        closestSeed = seed;
      }
    });

    this.target = closestSeed;
  }

  moveTowardTarget() {
    if (!this.target) return;

    let dx = this.target.coordinate.x - this.coordinate.x;
    let dy = this.target.coordinate.y - this.coordinate.y;

    let distance = dist(this.coordinate.x, this.coordinate.y, this.target.coordinate.x, this.target.coordinate.y);

    if (distance < 10) {
      this.eatSeed(seeds, this.targetIndex);
    }

    let directionX = dx / distance;
    let directionY = dy / distance;

    this.coordinate.x += directionX * this.speed;
    this.coordinate.y += directionY * this.speed;
  }

  eatSeed(seeds, seedIndex) {
    seeds.splice(seedIndex, 1);
    this.target = null;
  }

  draw() {
    fill("black");
    circle(this.coordinate.x, this.coordinate.y, 25);
  }
}
