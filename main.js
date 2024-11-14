let timer = 15;
let infinityTimer = 0;

let marie;
let seeds;
let humans;

let bGameOver;
let bStartGame = false;
let isDarkMode = false;

// Game Mode selection
let dayModeButton, nightModeButton;
let gameModeLabel;

// Timer selection
let timerSlider;
let gameTimerLabel;

let startGameButton;

function setup() {
  frameRate(30); // 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();

  drawHomeScreen();
  drawGameModeSelection();
  drawGameTimeSelection();

  startGameButton = createButton("Lancé la partie !");
  startGameButton.size(130, 40);
  startGameButton.position(width / 2 - 50, timerSlider.y + 50);
  startGameButton.mousePressed(startGame);

  // interaction clavier avec la touche ENTER pour lancer la partie
  keyPressed = () => {
    if (keyCode === ENTER) {
      startGame();
    }
  };
}

function drawHomeScreen() {
  // TODO : ajouter un cercle au fond, positionner les boutons (+ design)
  // TODO : mode nuit, changer le background plus sombre... effet classe
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
  dayModeButton = createButton("Jour");
  dayModeButton.size(100, 40);
  dayModeButton.mousePressed(() => {
    isDarkMode = false;
  });
  dayModeButton.position(width / 2 - 100, height / 4);

  nightModeButton = createButton("Nuit");
  nightModeButton.size(100, 40);
  nightModeButton.mousePressed(() => {
    isDarkMode = true;
  });
  nightModeButton.position(width / 2 + 100, height / 4);

  // Label d'information on utilise une div et pas un text pour pouvoir écrire derrière plus facilement
  gameModeLabel = createDiv("");
  gameModeLabel.style("font-size", "24px");
  gameModeLabel.style("color", "#000");
  gameModeLabel.style("font-weight", "bold");
  gameModeLabel.position(nightModeButton.x, nightModeButton.y + 80);
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
  /* Timeout nécessaire pour éviter que le clique sur le bouton de lancement de jeu 
  soit considéré comme un clique qui dépose une première graine */
  setTimeout(() => {
    // Nettoyage du canvas
    dayModeButton.remove();
    nightModeButton.remove();
    gameModeLabel.remove();
    timerSlider.remove();
    gameTimerLabel.remove();
    startGameButton.remove();

    // Initialisation du timer

    if (timerSlider.value() !== 0) {
      infinityTimer = -1;
      timer = timerSlider.value();
      setInterval(() => {
        timer--;
      }, 1000);
    } else {
      timer = -1;
      infinityTimer = 0;
      // On sauvegarde le temps en mode infini pour que le joueur puisse flex ensuite
      setInterval(() => {
        infinityTimer++;
      }, 1000);
    }

    // Initialisation du jeu
    bStartGame = true;
    bGameOver = false;
    humans = [];
    seeds = [];
    marie = new Marie(width / 2, height / 2);
  }, 100);
}

function touchStarted() {
  if (bStartGame) {
    seeds.push(new Seed(mouseX, mouseY, Math.floor(Math.random() * 25) + 5));
  }
}

function draw() {
  // le jeu n'a pas start,
  if (!bStartGame) {
    gameModeLabel.html(
      isDarkMode ? "Plongeon dans l'obscurité" : "Ballade en journée"
    );
    gameTimerLabel.html("Temps de survie : " + timerSlider.value() + "s");
    if (timerSlider.value() === 0) {
      gameTimerLabel.html("On part sur un temps ∞ !");
    }
    return;
  }

  background("#a3b18a");
  // ajout d'une ombre toutes les 5 secondes
  if (frameCount % 60 === 0) {
    // 1 pieds toutes les deux secondes (60 Frames, 30FPS)
    humans.push(new Human(random(100, width - 100), random(200, height - 150)));
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
  // TODO : relancer une partie, menu stop ?

  if (timer === 0 || bGameOver) {
    console.log("fin de partie");
    console.log("SCORE = ", marie.score);
    if (!bGameOver) {
      console.log("Bravo, vous ne vous êtes pas fait écrasé !");
    } else {
      console.log("Dommage, il vous restait " + timer + " secondes à tenir");
      console.log("hey :", infinityTimer);
    }
    initGame(); // arrêt via une erreur pour le moment, ça m'arrange
  }

  fill(0, 0, 0);
  if (timer === -1) {
    text("infini", 50, 100);
  } else {
    text(timer, 50, 100);
  }

  marie.lookForClosestSeed(seeds);
  marie.moveTowardTarget();

  seeds.forEach((seed) => seed.draw());

  marie.draw();
}

// TODO : faire un mode nuit
