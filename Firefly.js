class Firefly {
  constructor(pX, pY, pDarkLayer) {
    this.coordinate = {
      x: pX,
      y: pY,
    };
    this.vision = 80;
    this.diameter = 20;
    this.darkLayer = pDarkLayer;
  }

  draw() {
    console.log("draww");
    this.darkLayer.erase();
    this.darkLayer.fill(255, 0, 255);
    this.darkLayer.circle(this.coordinate.x, this.coordinate.y, this.vision);
    //this.darkLayer.fill(255, 0, 255);
    //this.darkLayer.circle(this.coordinate.x, this.coordinate.y, this.diameter);
    this.darkLayer.noErase();
  }

  animate() {
    console.log("animate");
  }
}
