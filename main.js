let timer = 15;
let infinityTimer = 0;
let saveTimer; // On garde en mémoire le temps
let intervalTimer;

let marie, seeds, humans;

let bGameOver;
let bStartGame = false;
let isNightMode = false;
let bGamePaused = false; // figer le jeu en fin de partie

// Game Mode selection
let dayModeButton, nightModeButton, gameModeLabel;

// Timer selection
let timerSlider, gameTimerLabel;

let startGameButton;
let infoButton;
let endGamePopUp;

// Ajout d'un plan pour le mode nuit
let nightCanvas;
let predator;

/* Fonction qui sert de point d'entrée du jeu. On définit certains paramètres 
et on dessine une première fois l'accueil.Tout ce qui est impacté par un changement 
lié à une interaction/animation est dessiné dans draw() directement */
function setup() {
  frameRate(30); // 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();

  nightCanvas = createGraphics(windowWidth, windowHeight);
  nightCanvas.noStroke();

  drawGameModeSelection();
  drawGameTimeSelection();

  startGameButton = createButton("Jouer");
  startGameButton.size(100, 40);
  startGameButton.position(width / 2 - 50, timerSlider.y + 50);
  startGameButton.mousePressed(() => {
    // Nettoyage du canvas avec l'accueil et lancement du jeu
    dayModeButton.remove();
    nightModeButton.remove();
    infoButton.remove();
    timerSlider.remove();
    gameTimerLabel.remove();
    startGameButton.remove();

    startGame();
  });

  infoButton = createButton("?");
  infoButton.size(width / 16, width / 16);
  infoButton.position(width - width / 14, height / 24);
  infoButton.style("border-radius", "100px");
  infoButton.mousePressed(showInformationsPopUp);

  // interaction clavier avec la touche ENTER pour lancer la partie
  keyPressed = () => {
    if (keyCode === ENTER) {
      startGame();
    }
  };
}

function showInformationsPopUp() {
  alert(
    "Le saviez-vous ? \nIl s'agit d'un projet étudiant du M2 CIM (DT), développé par Matthieu Guillemin et Guillaume Hostache. \nOn remercie les livres \"Drôles de petites bêtes\" pour l'inspiration :)"
  );
}

function drawHomeScreen() {
  background(isNightMode ? "#2c3e50" : "#a7c957");

  fill(isNightMode ? "#bdc3c7" : "#386641");
  circle(width / 42, height + height / 8, width / 4);
  circle(width, 0, width / 4);

  fill(isNightMode ? "#ffffff" : "#000000");
  textAlign(CENTER, CENTER);
  textSize(42);
  text("Insecte-qui-peut !", width / 2, height / 6);
}

function drawGameModeSelection() {
  dayModeButton = createButton("Jour");
  dayModeButton.size(100, 40);
  dayModeButton.mousePressed(() => {
    isNightMode = false;
    updateButtonStyles();
  });
  dayModeButton.position(width / 2 - 110, height / 3);

  nightModeButton = createButton("Nuit");
  nightModeButton.size(100, 40);
  nightModeButton.mousePressed(() => {
    isNightMode = true;
    updateButtonStyles();
  });
  nightModeButton.position(width / 2 + 10, height / 3);

  updateButtonStyles();
}

function updateButtonStyles() {
  dayModeButton.style("background-color", isNightMode ? "#7f8c8d" : "#ffffff");
  dayModeButton.style("color", isNightMode ? "#ecf0f1" : "#000000");
  nightModeButton.style(
    "background-color",
    isNightMode ? "#34495e" : "#bdc3c7"
  );
  nightModeButton.style("color", isNightMode ? "#ecf0f1" : "#2c3e50");
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
    marie = new Marie(width / 2, height / 2, isNightMode ? nightCanvas : null);

    if (isNightMode) predator = new Predator(width / 8, height / 8);
  }, 100);
}

// à chaque clique/touche, on dépose une graine de taille aléatoire
function touchStarted() {
  if (bStartGame && !bGamePaused) {
    let seed = new Seed(mouseX, mouseY, Math.floor(Math.random() * 25) + 5);

    if (isNightMode) {
      /* Mode nuit, on ne peut poserles graines que dans le champ de vision de Marie 
      distance entre la touche (graine) et marie */
      let distanceToMarie = dist(
        marie.coordinate.x,
        marie.coordinate.y,
        mouseX,
        mouseY
      );

      // On définit aussi un angle pour les deux autres cercles qui font office de vision de l'insecte
      let angleToMouse = atan2(
        mouseY - marie.coordinate.y,
        mouseX - marie.coordinate.x
      );

      let angleDiff = abs(angleToMouse - marie.currentAngle);
      if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;

      /* Triple vérification : premier cercle, second cercle et dernier cercle de vision
      très approximatif */
      if (
        distanceToMarie < 40 ||
        (distanceToMarie >= 40 &&
          distanceToMarie <= 100 &&
          angleDiff < radians(60)) ||
        (distanceToMarie > 100 &&
          distanceToMarie <= 125 &&
          angleDiff < radians(30))
      ) {
        seeds.push(seed);
      }
    } else {
      seeds.push(seed);
    }
  }
}

function drawGameInfo() {
  fill(!isNightMode ? "black" : "white");
  textSize(24);
  if (timer === -1) {
    text("∞", width / 2, height / 24);
  } else {
    text(timer, width / 2, height / 24);
  }
  textSize(18);
  text("SCORE " + marie.score, width / 2, height / 10);
}

function updateGameSituation() {
  /* 3 motifs d'arrêts : Si le joueur a été écrasé (bGameOver) ou bien 
  Si la partie est terminé (temps limité) ou Si la partie est infini, et que le joueur a été écrasé */
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
  endGamePopUp = createDiv(
    "<h3>" +
      title +
      "</h3><p>" +
      timeMessage +
      "</p><p>" +
      scoreMessage +
      "</p>"
  );

  endGamePopUp.style("padding", "15px");
  endGamePopUp.style("background-color", isNightMode ? "#34495e" : "#ecf0f1");
  endGamePopUp.style("color", isNightMode ? "#ecf0f1" : "#34495e");
  endGamePopUp.style("position", "absolute");
  endGamePopUp.style("top", "50%");
  endGamePopUp.style("left", "50%");
  endGamePopUp.style("transform", "translate(-50%, -50%)");
  endGamePopUp.style("text-align", "center");
  endGamePopUp.style("width", "500px");

  let newGameButton = createButton("Nouvelle partie");
  newGameButton.parent(endGamePopUp);
  newGameButton.mousePressed(newGame);

  let restartButton = createButton("Rejouer le niveau");
  restartButton.parent(endGamePopUp);
  restartButton.mousePressed(replayGame);
}

// relance une partie identique
function replayGame() {
  if (endGamePopUp) endGamePopUp.remove();

  startGame();
}

// redirige vers l'écran d'accueil
function newGame() {
  timer = timerSlider.value();
  infinityTimer = 0;
  isNightMode = false;

  bStartGame = false;

  if (endGamePopUp) endGamePopUp.remove();

  setup();
}

/* Boucle principale du jeu : Si le jeu n'a pas commencé, on dessine certains éléments 
et certaines animations de l'accueil. Quand la partie commence, gère le jeu 
en fonction des paramètres de la partie. */
function draw() {
  if (!bStartGame) {
    drawHomeScreen();

    gameTimerLabel.style("color", isNightMode ? "#ffffff" : "#000000");

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

  if (bGamePaused) return; // On fige la partie -> utile pour les fins de partie

  background("#a3b18a");

  if (!isNightMode) {
    // On génère une ombre d'ennemi toutes les 30 frames
    if (frameCount % 30 === 0) {
      humans.push(
        new Human(random(0, width), random(150, height), isNightMode)
      );
    }

    humans = humans.filter((h) => {
      h.draw();
      if (h.diameter > 150) {
        let touche = h.detectInsect(marie.coordinate.x, marie.coordinate.y);
        if (touche) {
          bGameOver = true;
        }
      }
      return h.diameter < 190;
    });
  } else {
    predator.draw();
    //predator.move();

    // Vérifier si Marie est détectée par le crapaud
    if (predator.detectInsect(marie.coordinate.x, marie.coordinate.y)) {
      bGameOver = true;
    }
  }

  seeds.forEach((seed) => seed.draw());

  if (isNightMode) {
    nightCanvas.clear();
    nightCanvas.fill(0);
    nightCanvas.rect(0, 0, width, height);
  }

  marie.draw();

  if (isNightMode) image(nightCanvas, 0, 0);

  marie.lookForClosestSeed(seeds);
  marie.moveTowardTarget();

  drawGameInfo();
  updateGameSituation();
}
