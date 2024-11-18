/* Classe utilisé pour représenter les confettis de notre animation en cas de victoire
On dessine un carré avec un effet de gravité, une rotation aléatoire (pour l'effet confetti)
On passe également en paramètre un canvas à part pour éviter les conflits avec les canvas de jeu. */
class Confetti {
    constructor(x, y, size, colors, pCanvas) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colors = colors;
        this.angle = random(TWO_PI);
        // vitesse de mouvement de nos confettis
        this.speedX = random(-2, 2);
        this.speedY = random(-5, -2);
        this.gravity = 0.1;
        this.canvas = pCanvas;
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.angle += 0.1;
    }

    draw() {
        this.canvas.push();
        this.canvas.translate(this.x, this.y);
        this.canvas.rotate(this.angle);
        this.canvas.fill(this.colors);
        this.canvas.rect(0, 0, this.size, this.size);
        this.canvas.pop();
    }

    isOffScreen() {
        // si la confetti atteint le bas de l'écran
        return this.y > this.canvas.height;
    }
}