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
let infosPopUp;

// Ajout d'un plan pour le mode nuit
let nightCanvas;
let predators;

let antImg, seedImg, toadImg, humanHand, humanFoot;

let font;

function preload() {
  font = loadFont("fonts/SourGummy-VariableFont_wdth,wght.ttf");

  antImg = loadImage("assets/ant-50x50.png");
  toadImg = loadImage("assets/toad.png");
  humanHand = loadImage("assets/humanHand.png");
  humanFoot = loadImage("assets/humanFoot.png");
}

/* Fonction qui sert de point d'entrée du jeu. On définit certains paramètres 
et on dessine une première fois l'accueil. Tout ce qui est impacté par un changement
lié à une interaction/animation est dessiné dans draw() directement */
function setup() {
  frameRate(30); // 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont(font);

  nightCanvas = createGraphics(windowWidth, windowHeight);
  nightCanvas.noStroke();

  drawGameModeSelection();
  drawGameTimeSelection();

  startGameButton = createButton("Jouer");
  startGameButton.size(100, 40);
  startGameButton.position(width / 2 - 50, timerSlider.y + 50);
  startGameButton.mousePressed(() => {
    runGame()
  });

  infoButton = createButton("?");
  infoButton.size(width / 16, width / 16);
  infoButton.position(width - width / 14, height / 24);
  infoButton.style("border-radius", "100px");
  infoButton.mousePressed(showInformationsPopUp);

  // interaction clavier avec la touche ENTER pour lancer la partie
  keyPressed = () => {
    if (keyCode === ENTER) {
      runGame();
    }
  };
}

function runGame() {
  // Nettoyage du canvas avec l'accueil et lancement du jeu
  dayModeButton.remove();
  nightModeButton.remove();
  infoButton.remove();
  timerSlider.remove();
  gameTimerLabel.remove();
  startGameButton.remove();

  startGame();
}

function showInformationsPopUp() {
  infosPopUp = createDiv(
      "<h3>Règles du jeu</h3>" +
      "<p>Votre objectif est de permettre à <em>Marie la fourmi</em> de survivre le plus longtemps possible dans ce monde trop hostile pour une bestiole de son gabarit.</p>" +
      "<p>De jour ou de nuit, soyez attentifs !</p>" +
      "<p>De jour : À intervalle de temps variable, l’ombre du pied (ou de la main) d’un humain malveillant apparaît à l’écran et indique alors au joueur la zone à fuir au plus vite. Si la fourmi se trouve sous le pied (ou la main) de l’humain au moment où il (ou elle) touche le sol, c’est la mort assurée.</p>" +
      "<p>De nuit : Un crapaud tapi dans la pénombre attend que la fourmi entre dans son champ de vision pour la manger. Avancez à tatons pour localiser le danger et faire grimper votre score.</p>" +
      "<h3>Crédits</h3>" +
      "<p><strong>Insecte-qui-peut!</strong> est un projet étudiant du M2 CIM (DT), développé par <strong>Matthieu Guillemin</strong> et <strong>Guillaume Hostache</strong>. \nOn remercie les livres \"Drôles de petites bêtes\" pour l'inspiration :)</p>"
  );

  infosPopUp.style("background-color", isNightMode ? "#34495e" : "#ecf0f1");
  infosPopUp.style("color", isNightMode ? "#ecf0f1" : "#34495e");
  infosPopUp.addClass('infosPopUp');

  let okDiv = createDiv();
  okDiv.addClass("ok");

  okDiv.parent(infosPopUp);
  let okButton = createButton("OK");
  okButton.parent(okDiv);
  okButton.mousePressed(removeInfosPopUp);
}

function removeInfosPopUp() {
  if (infosPopUp) infosPopUp.remove();
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
  dayModeButton.size(150, 40);
  dayModeButton.mousePressed(() => {
    isNightMode = false;
    updateButtonStyles();
  });
  dayModeButton.position(width / 2 - 150, height / 3);

  nightModeButton = createButton("Nuit");
  nightModeButton.size(150, 40);
  nightModeButton.mousePressed(() => {
    isNightMode = true;
    updateButtonStyles();
  });
  nightModeButton.position(width / 2 + 20, height / 3);

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
    predators = [];
    marie = new Marie(width / 2, height / 2, isNightMode ? nightCanvas : null);

    if (isNightMode) predators.push(new Predator(width / 8, height / 8));
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
        ? "Dommage, vous avez perdu..."
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

  endGamePopUp.style("background-color", isNightMode ? "#34495e" : "#ecf0f1");
  endGamePopUp.style("color", isNightMode ? "#ecf0f1" : "#34495e");
  endGamePopUp.addClass("endGamePopUp");

  let newGameButton = createButton("Nouvelle partie");
  newGameButton.addClass("newGameButton");
  newGameButton.parent(endGamePopUp);
  newGameButton.mousePressed(newGame);

  let restartButton = createButton("Rejouer le niveau");
  newGameButton.addClass("replayButton");
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
      let alea = Math.random();
      humans.push(
        new Human(random(0, width), random(150, height), alea > 0.5 ? humanFoot : humanHand, isNightMode)
      );
    }

    // TODO après test, modifier la vitesse des ombres ?

    humans = humans.filter((h) => {
      h.draw();
      if (h.sx > 160) {
        let touche = h.detectInsect(marie.coordinate.x, marie.coordinate.y);
        if (touche) {
          bGameOver = true;
        }
      }
      return h.sx < 220;
    });
  } else {
    predators.forEach((p) => {
      p.draw(toadImg);
      p.move();
      // Vérifier si Marie est détectée par le crapaud
      if (p.detectInsect(marie.coordinate.x, marie.coordinate.y))
        bGameOver = true;
    });

    // mode infini, ajout d'un predator toutes les 60 secondes (1800 frames) jusqu'à ce qu'il y ait 4 predateurs sur le terrain
    if (timer === -1 && frameCount % 1800 === 0 && predators.length < 4) {
      predators.push(new Predator(width / 8, height / 8));
    }
    // mode temps limité, ajout d'un predator toutes les 80 secondes (2400 frames), max 3 predateurs sur le terrain
    if (
      infinityTimer === -1 &&
      frameCount % 2400 === 0 &&
      predators.length < 3
    ) {
      predators.push(new Predator(width / 8, height / 8));
    }
  }

  seeds.forEach((seed) => seed.draw());

  if (isNightMode) {
    nightCanvas.clear();
    nightCanvas.fill(0);
    nightCanvas.rect(0, 0, width, height);
  }

  if (marie.target && marie.coordinate.x < marie.target.coordinate.x) {
    marie.draw(antImg, "toTheRight");
  } else {
    marie.draw(antImg, "toTheLeft");
  }

  if (isNightMode) image(nightCanvas, 0, 0);

  marie.lookForClosestSeed(seeds);
  marie.moveTowardTarget();

  drawGameInfo();
  updateGameSituation();
}
