let timer = 15;
let infinityTimer = 0;
let saveTimer; // On garde en mémoire le temps
let intervalTimer;

let marie;
let seeds;
let humans;

let bGameOver;
let bStartGame = false;
let isDarkMode = false;
let bGamePaused = false; // figer le jeu en fin de partie

// Game Mode selection
let dayModeButton, nightModeButton;
let gameModeLabel;

// Timer selection
let timerSlider;
let gameTimerLabel;

let startGameButton;
let infoButton;

let endGamePopup;

/* Fonction qui sert de point d'entrée du jeu. On définit certains paramètres et on dessine une première fois l'accueil.
Tout ce qui est impacté par un changement lié à une interaction/animation est dessiné dans draw() directement */
function setup() {
  frameRate(30); // 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();

  drawGameModeSelection();
  drawGameTimeSelection();

  startGameButton = createButton("Jouer");
  startGameButton.size(100, 40);
  startGameButton.position(width / 2 - 50, timerSlider.y + 50);
  startGameButton.mousePressed(() => {
    // Nettoyage du canvas avec l'accueil
    dayModeButton.remove();
    nightModeButton.remove();
    infoButton.remove();
    timerSlider.remove();
    gameTimerLabel.remove();
    startGameButton.remove();
    // lancement du jeu
    startGame();
  });

  infoButton = createButton("?");
  infoButton.size(width / 16, width / 16);
  infoButton.position(width - width / 14, height / 24);
  infoButton.style("border-radius", "100px");
  infoButton.mousePressed(displayInfoPopUp);

  // interaction clavier avec la touche ENTER pour lancer la partie
  keyPressed = () => {
    if (keyCode === ENTER) {
      startGame();
    }
  };
}

function displayInfoPopUp() {
  // TODO : écrire les règles du jeu dans la pop up ?
  alert(
    "Le saviez-vous ? \nIl s'agit d'un projet étudiant du M2 CIM (DT), développé par Matthieu Guillemin et Guillaume Hostache. \nOn remercie les livres \"Drôles de petites bêtes\" pour l'inspiration :)"
  );
}

function drawHomeScreen() {
  if (isDarkMode) {
    background("#2c3e50");
    fill("#bdc3c7");
  } else {
    background("#a7c957");
    fill("#386641");
  }

  circle(width / 42, height + height / 8, width / 4);
  circle(width, 0, width / 4);

  fill(isDarkMode ? "#ffffff" : "#000000");
  textAlign(CENTER, CENTER);
  textSize(42);
  text("Insecte-qui-peut !", width / 2, height / 6);
}

function drawGameModeSelection() {
  dayModeButton = createButton("Jour");
  dayModeButton.size(100, 40);
  dayModeButton.mousePressed(() => {
    isDarkMode = false;
    updateButtonStyles();
  });
  dayModeButton.position(width / 2 - 110, height / 3);

  nightModeButton = createButton("Nuit");
  nightModeButton.size(100, 40);
  nightModeButton.mousePressed(() => {
    isDarkMode = true;
    updateButtonStyles();
  });
  nightModeButton.position(width / 2 + 10, height / 3);

  updateButtonStyles();
}

function updateButtonStyles() {
  dayModeButton.style("background-color", isDarkMode ? "#7f8c8d" : "#ffffff");
  dayModeButton.style("color", isDarkMode ? "#ecf0f1" : "#000000");
  nightModeButton.style("background-color", isDarkMode ? "#34495e" : "#bdc3c7");
  nightModeButton.style("color", isDarkMode ? "#ecf0f1" : "#2c3e50");
}

function drawGameTimeSelection() {
  timerSlider = createSlider(0, 300, timer);
  timerSlider.position(windowWidth / 2 - 162.5, height / 2 + height / 12);
  timerSlider.style("width", "325px");

  gameTimerLabel = createDiv("");
  gameTimerLabel.position(timerSlider.x, timerSlider.y - 30);
  gameTimerLabel.style("font-size", "14px");
}

function startGame() {
  /* Timeout de 100 ms, nécessaire pour éviter que le clique sur le bouton de lancement de jeu 
  soit considéré comme un clique qui dépose une première graine */
  setTimeout(() => {
    // Initialisation du timer, tiens compte du mode infini
    clearInterval(intervalTimer);
    if (timerSlider.value() !== 0) {
      infinityTimer = -1;
      timer = timerSlider.value();
      saveTimer = timer;
      intervalTimer = setInterval(() => {
        timer--;
      }, 1000);
    } else {
      timer = -1;
      infinityTimer = 0;
      intervalTimer = setInterval(() => {
        infinityTimer++;
      }, 1000);
    }

    // Initialisation du jeu
    bStartGame = true;
    bGameOver = false;
    bGamePaused = false;
    humans = [];
    seeds = [];
    marie = new Marie(width / 2, height / 2);
  }, 100);
}

// à chaque clique/touche, on dépose une graine de taille aléatoire
function touchStarted() {
  if (bStartGame && !bGamePaused) {
    seeds.push(new Seed(mouseX, mouseY, Math.floor(Math.random() * 25) + 5));
  }
}

/* Boucle principale du jeu : Si le jeu n'a pas commencé, on dessine certains éléments 
et certaines animation de l'accueil. Quand la partie commence, gère le jeu en fonction des paramètres de la partie. */
function draw() {
  if (!bStartGame) {
    drawHomeScreen();

    gameTimerLabel.style("color", isDarkMode ? "#ffffff" : "#000000");

    gameTimerLabel.html(
      "Arriverez-vous à survivre pendant " +
        timerSlider.value() +
        " secondes..."
    );
    if (timerSlider.value() === 0) {
      gameTimerLabel.html("Survivez le plus longtemps possible !");
    }
    return;
  }

  if (bGamePaused) return; // fige la partie

  if (!isDarkMode) {
    background("#a3b18a");

    fill("black");
    textSize(24);
    if (timer === -1) {
      text("∞", width / 2, height / 24);
    } else {
      text(timer, width / 2, height / 24);
    }
    textSize(18);
    text("SCORE " + marie.score, width / 2, height / 10);

    if (frameCount % 60 === 0) {
      humans.push(new Human(random(0, width), random(150, height)));
    }

    humans = humans.filter((h) => {
      h.draw();
      if (h.diameter > 185) {
        let touche = h.detectInsect(marie.coordinate.x, marie.coordinate.y);
        if (touche) {
          bGameOver = true;
        }
      }
      return h.diameter < 230;
    });

    marie.lookForClosestSeed(seeds);
    marie.moveTowardTarget();

    seeds.forEach((seed) => seed.draw());

    marie.draw();
    updateGameSituation();
  } else {
    console.log("DarkMode à implémenter");
  }
}

function updateGameSituation() {
  if ((timer === -1 && bGameOver) || timer === 0 || bGameOver) {
    bGamePaused = true;
    let title, timeMessage, scoreMessage;
    if (timer >= 0) {
      title = bGameOver
        ? "Dommage, vous avez été écrasé..."
        : "Félicitations, vous avez réussi !";
      timeMessage =
        "Vous avez survécu pendant " + str(saveTimer - timer) + " secondes.";
    } else {
      title = "C'est terminé !";
      timeMessage = "Vous avez survécu pendant " + infinityTimer + " secondes.";
    }
    scoreMessage = "Votre score: " + marie.score;
    drawEndGamePopUp(title, timeMessage, scoreMessage);
  }
}

function drawEndGamePopUp(title, timeMessage, scoreMessage) {
  endGamePopup = createDiv(
    "<h3>" +
      title +
      "</h3><p>" +
      timeMessage +
      "</p><p>" +
      scoreMessage +
      "</p>"
  );

  endGamePopup.style("padding", "15px");
  endGamePopup.style("background-color", isDarkMode ? "#34495e" : "#ecf0f1");
  endGamePopup.style("color", isDarkMode ? "#ecf0f1" : "#34495e");
  endGamePopup.style("position", "absolute");
  endGamePopup.style("top", "50%");
  endGamePopup.style("left", "50%");
  endGamePopup.style("transform", "translate(-50%, -50%)");
  endGamePopup.style("text-align", "center");
  endGamePopup.style("width", "500px");

  let newGameButton = createButton("Nouvelle partie");
  newGameButton.parent(endGamePopup);
  newGameButton.mousePressed(resetGame);

  let restartButton = createButton("Rejouer le niveau");
  restartButton.parent(endGamePopup);
  restartButton.mousePressed(replayGame);
}

function replayGame() {
  if (endGamePopup) endGamePopup.remove();

  startGame();
}

function resetGame() {
  timer = timerSlider.value();
  infinityTimer = 0;

  bStartGame = false;

  if (endGamePopup) endGamePopup.remove();

  setup();
}
