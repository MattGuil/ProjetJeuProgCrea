let timer = 15;
let marie;
let seeds;
let humans;
let bGameOver;
let bStartGame = false;
let isDarkMode = false;

// Game Mode selection
let toggleButton, toggleCircle;
let gameModeLabel;

// Timer selection
let timerSlider;
let gameTimerLabel;

let startGameButton;

function setup() {
  frameRate(30); // Définir à 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();

  drawHomeScreen();

  drawGameModeSelection();

  drawGameTimeSelection();

  startGameButton = createButton("Lancé la partie !");
  startGameButton.size(130, 40);
  startGameButton.position(width / 2 - 50, timerSlider.y + 50);
  startGameButton.mousePressed(startGame);

  // Écouter la touche 'Enter' pour démarrer le jeu
  keyPressed = () => {
    if (keyCode === ENTER) {
      startGame();
    }
  };
}

function drawHomeScreen() {
  background("#a7c957");
  fill("#386641");
  circle(width / 42, height + height / 8, width / 4);
  circle(width, 0, width / 4);

  fill("#000000");
  textAlign(CENTER, CENTER);
  textSize(32);
  text("Insecte-qui-peut !", width / 2, height / 6);
}

function drawGameModeSelection() {
  toggleButton = createButton("");
  toggleButton.size(80, 40);
  toggleButton.style("background-color", "#000");
  toggleButton.style("border-radius", "50px");
  toggleButton.style("border", "2px solid #fff");
  toggleButton.mousePressed(toggleGameMode); // interaction

  // le cercle qui va bougé dans le bouton
  toggleCircle = createDiv();
  toggleCircle.size(30, 30);
  toggleCircle.style("background-color", "#fff");
  toggleCircle.style("border-radius", "50px");
  toggleCircle.style("transition", "0.5s");
  toggleButton.child(toggleCircle);

  toggleButton.position(width / 2 - 100, height / 2 - 50);

  // Label d'information
  gameModeLabel = createDiv("Mode : Jour");
  gameModeLabel.style("font-size", "24px");
  gameModeLabel.style("color", "#000");
  gameModeLabel.style("font-weight", "bold");
  gameModeLabel.position(
    toggleButton.x + toggleButton.width + 20,
    toggleButton.y
  );
}

function toggleGameMode() {
  isDarkMode = !isDarkMode;
  let circle = toggleButton.elt.querySelector("div");

  if (isDarkMode) {
    circle.style.transform = "translateX(35px)";
    circle.style.backgroundColor = "#000";
    toggleButton.style("background-color", "#fff");
    gameModeLabel.html("Mode : Nuit");
  } else {
    circle.style.transform = "translateX(0px)";
    circle.style.backgroundColor = "#fff";
    toggleButton.style("background-color", "#000");
    gameModeLabel.html("Mode : Jour");
  }
}

function drawGameTimeSelection() {
  timerSlider = createSlider(0, 180, timer);
  timerSlider.position(width / 2 - 150, height / 2 + 50);
  timerSlider.style("width", "300px");

  gameTimerLabel = createDiv("Temps de survie : 15s");
  gameTimerLabel.position(timerSlider.x, timerSlider.y - 30);
  gameTimerLabel.style("font-size", "18px");
  gameTimerLabel.style("color", "#000");
  gameTimerLabel.style("font-weight", "bold");
}

function startGame() {
  toggleButton.remove();
  gameModeLabel.remove();
  timerSlider.remove();
  gameTimerLabel.remove();
  startGameButton.remove();
  bStartGame = true;
  timer = timerSlider.value();
  if (timer !== 0) {
    setInterval(() => {
      timer--;
    }, 1000);
  }
  initGame();
}

function initGame() {
  humans = [];
  seeds = [];
  marie = new Marie(width / 2, height / 2);
  bGameOver = false;
}

function touchStarted() {
  if (bStartGame) {
    seeds.push(new Seed(mouseX, mouseY, Math.floor(Math.random() * 25) + 5));
  }
}

function draw() {
  // le jeu n'a pas start,
  if (!bStartGame) {
    gameTimerLabel.html("Temps de survie : " + timerSlider.value() + "s");
    if (timerSlider.value() === 0) {
      gameTimerLabel.html("On part sur un temps ∞ !");
    }
  } else {
    background("#a3b18a");
    // ajout d'une ombre toutes les 5 secondes
    if (frameCount % 60 === 0) {
      // 1 pieds toutes les deux secondes (60 Frames, 30FPS)
      humans.push(
        new Human(random(100, width - 100), random(200, height - 150))
      );
    }

    humans = humans.filter((h) => {
      h.draw();
      if (h.diameter > 185) {
        let touche = h.detectInsect(marie.coordinate.x, marie.coordinate.y);
        if (touche) {
          bGameOver = true; // C'est fini
        }
      }
      return h.diameter < 230;
    });

    // fin de partie
    if (timer === 0 || bGameOver) {
      console.log("fin de partie");
      console.log("SCORE = ", marie.score);
      if (!bGameOver) {
        console.log("Bravo, vous ne vous êtes pas fait écrasé !");
      } else {
        console.log("Dommage, il vous restait " + timer + " secondes à tenir");
      }
      initGame();
    }

    fill(0, 0, 0);
    text(timer, 50, 100);

    marie.lookForClosestSeed(seeds);
    marie.moveTowardTarget();

    seeds.forEach((seed) => seed.draw());

    marie.draw();
  }
}
