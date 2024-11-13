class Human {
    constructor(pX, pY) {
        this.x = pX;
        this.y = pY;
        this.radius = 10;
    }

    draw() {
        fill(0, 0, 0);
        circle(this.x, this.y, this.radius, this.radius);
        this.radius+=2;
    }

    detectInsect() {
        console.log("detectInsect");
    }
}