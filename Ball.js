class Ball {
    constructor(posX, posY, speedX, speedY, color, radius) {
        this.coordinate = {
        x: posX,
        y: posY
        };
        this.speed = {
        x: speedX,
        y: speedY
        };
        this.color = color;
        this.radius = radius;
    }

    draw() {
        fill(this.color);
        circle(this.coordinate.x, this.coordinate.y, this.radius);
        this.coordinate.x += this.speed.x;
        this.coordinate.y += this.speed.y;
    }

    setSpeed(speed) {
        this.speed = speed;
    }
}