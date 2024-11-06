let ball;
let lifebar;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  startGame();
}

function draw() {
  background("#ccd5ae");

  ball.draw();

  if (pointOver()) {
    lifebar.damage();
    if (gameOver()) {
      startGame();
    } else {
      startPoint();
    }
  }

  lifebar.draw();
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
  let directionX = ball.coordinate.x + mouseX;
  let directionY = ball.coordinate.y + mouseY;

  let magnitude = dist(ball.coordinate.x, ball.coordinate.y, mouseX, mouseY);
  let normalizedX = directionX / magnitude;
  let normalizedY = directionY / magnitude;

  let newSpeedX = normalizedX * 3;
  let newSpeedY = normalizedY * 3;

  ball.setSpeed({ x: newSpeedX, y: newSpeedY });
}
