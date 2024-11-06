class Lifebar {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    draw() {
        fill("white");
        rect(10, 10, 10, 10 * this.max);
        fill("lightgreen");
        rect(10, 10 * ((this.max - this.current) + 1), 10, 10 * this.current);
    }

    damage() {
        this.current--;
    }
}