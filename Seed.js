class Seed {
    constructor(x, y) {
        this.coordinate = {
            x: x,
            y: y
        };
    }

    draw() {
        fill("white");
        circle(this.coordinate.x, this.coordinate.y, 10);
    }
}