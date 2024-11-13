let ball;
let lifebar;

let bag;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  startGame();
  bag = new Bag([], 25, windowHeight - 90);
}

function draw() {
  background("#ccd5ae");

  bag.draw();
}

function startPoint() {
  ball = new Ball(
    width / 2,
    height / 2,
    Math.random() * 3 - 1,
    Math.random() * 3 - 1,
    "blue",
    25
  );
}

function startGame() {
  ball = new Ball(
    width / 2,
    height / 2,
    Math.random() * 3 - 1,
    Math.random() * 3 - 1,
    "blue",
    25
  );

  lifebar = new Lifebar(5);
}

function pointOver() {
  return (
    ball.coordinate.x > width + ball.radius ||
    ball.coordinate.x < 0 - ball.radius ||
    ball.coordinate.y > height + ball.radius ||
    ball.coordinate.y < 0 - ball.radius
  );
}

function gameOver() {
  return lifebar.current == 0;
}

function touchStarted() {
  // Gestion de l'ouverture/fermeture du sac, au clic
  let distBagMouse = dist(bag.bagX, bag.bagY, mouseX, mouseY);
  //console.log(distBagMouse);
  if (distBagMouse < 90) {
    if (bag.isOpen) {
      bag.closeBag();
    } else {
      bag.openBag();
    }
  }

  let directionX = ball.coordinate.x + mouseX;
  let directionY = ball.coordinate.y + mouseY;

  let magnitude = dist(ball.coordinate.x, ball.coordinate.y, mouseX, mouseY);
  let normalizedX = directionX / magnitude;
  let normalizedY = directionY / magnitude;

  let newSpeedX = normalizedX * 3;
  let newSpeedY = normalizedY * 3;

  ball.setSpeed({ x: newSpeedX, y: newSpeedY });
}
