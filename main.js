// Variables de gestion pour l'animation confetti
let confettis = [];
let bShowConfettis = false;

/* Variables principales représentants :
 - notre fourmi Marie
 - ses alliés les lucioles (mode nuit)
 - les graines
 - les humains (prédateurs de Marie le jour)
 - les crapauds (prédateurs de Marie la nuit)
 */
let marie, seeds, humans, fireflies, predators;

// Variables de gestion du temps
let timer = 15;
let infinityTimer = 0;
let saveTimer; // On garde en mémoire le temps
let intervalTimer;
let timerSlider, gameTimerLabel;

// Variables représentants l'état du jeu
let bGameOver;
let bStartGame = false;
let bGamePaused = false; // figer le jeu en fin de partie
let bPlayMusics = true;
let bPlaySounds = true;

let isNightMode = false;

// Boutons
let musicsSwitchButton, soundsSwitchButton;
let infoButton;
let modeButtonsDiv, dayModeButton, nightModeButton;
let startGameButton;

// Pop-ups
let endGamePopUp;
let infosPopUp;

// Plan pour le mode nuit
let nightCanvas;

// Assets
let antImg, seedImg, predatorImg, humanHand, humanFoot;
let dayBackground, nightBackground, confettisBackground;

// Sons
let actionMusic, horrorMusic, summerNightAmbiance;
let victoryJingle, defeatJingle;
let crunchSoundEffect, footSmashSoundEffect, swallowSoundEffect;

let font;

/* boolean pour détecter si l'appareil est un téléphone ou non.
on s'en sert pour intégrer des boutons pour chaque interaction clavier disponible sur ordinateur */
let bIsMobile;

// les 3 boutons qui correspondent aux 3 interactions clavier sur mobile
let echapButton, leakButton, fireflyButton;

function preload() {

  // Chargement des éléments importés de l'extérieur

  // Police
  font = loadFont("fonts/SourGummy-VariableFont_wdth,wght.ttf");

  // Décors
  dayBackground = loadImage("assets/dayBackground.png");
  nightBackground = loadImage("assets/nightBackground.png");

  // Assets
  antImg = loadImage("assets/ant-50x50.png");
  seedImg = loadImage("assets/seed.png");
  predatorImg = loadImage("assets/predator.png");
  humanHand = loadImage("assets/humanHand.png");
  humanFoot = loadImage("assets/humanFoot.png");

  // Sons
  actionMusic = loadSound("sounds/action-music.mp3");
  horrorMusic = loadSound("sounds/horror-music.mp3");
  summerNightAmbiance = loadSound("sounds/summer-night-ambiance.mp3");
  victoryJingle = loadSound("sounds/victory-jingle.mp3");
  defeatJingle = loadSound("sounds/defeat-jingle.mp3");
  crunchSoundEffect = loadSound("sounds/crunch-sound-effect.mp3");
  footSmashSoundEffect = loadSound("sounds/foot-smash-sound-effect.mp3");
  swallowSoundEffect = loadSound("sounds/swallow-sound-effect.mp3");
}

function detectIsMobileDevice() {
  let details = navigator.userAgent;
  let regexp = /android|iphone|kindle|ipad/i;

  // retourn true si on est détecte un appareil mobile
  return regexp.test(details);
}

/* Fonction qui sert de point d'entrée au jeu.
On définit certains paramètres et on dessine une première fois l'accueil.
Tout ce qui est impacté par un changement lié à une interaction/animation est dessiné dans draw() directement */
function setup() {
  bIsMobile = detectIsMobileDevice();

  summerNightAmbiance.amp(0.1);
  horrorMusic.amp(0.1);
  actionMusic.amp(0.1);
  victoryJingle.amp(0.3);
  defeatJingle.amp(0.3);
  crunchSoundEffect.amp(1);
  footSmashSoundEffect.amp(1);
  swallowSoundEffect.amp(1);

  frameRate(60); // 60 FPS
  createCanvas(windowWidth, windowHeight); // Taille de l'écran de jeu qui s'adapte à la taille de l'écran
  noStroke();
  textFont(font);

  nightCanvas = createGraphics(windowWidth, windowHeight);
  nightCanvas.noStroke();

  confettisBackground = createGraphics(windowWidth, windowHeight);
  confettisBackground.noStroke();

  drawGameModeSelection();
  drawGameTimeSelection();

  startGameButton = createButton("Jouer");
  startGameButton.addClass("startGameButton");
  startGameButton.size(width/4, 100);
  startGameButton.position(width / 2 - startGameButton.width / 2, timerSlider.y + 100);
  startGameButton.mousePressed(() => {
    runGame();
  });

  infoButton = createButton("?");
  infoButton.size(width / 20, width / 20);
  infoButton.addClass("infoButton");
  infoButton.mousePressed(showInformationsPopUp);

  musicsSwitchButton = createButton("Musics<br><span class='on'>ON</span><span class='off'>OFF</span>");
  musicsSwitchButton.size(80, 80);
  musicsSwitchButton.position(25, 25);
  musicsSwitchButton.addClass('musicsSwitchButton on');
  musicsSwitchButton.mousePressed(() => {
    bPlayMusics = !bPlayMusics;
    if (bPlayMusics) {
      musicsSwitchButton.addClass('on');
      musicsSwitchButton.removeClass('off');
    }
    else {
      musicsSwitchButton.addClass('off');
      musicsSwitchButton.removeClass('on');
    }
    stopAllMusics();
  });

  soundsSwitchButton = createButton("Sounds<br><span class='on'>ON</span><span class='off'>OFF</span>");
  soundsSwitchButton.size(80, 80);
  soundsSwitchButton.position(125, 25);
  soundsSwitchButton.addClass('soundsSwitchButton on');
  soundsSwitchButton.mousePressed(() => {
    bPlaySounds = !bPlaySounds;
    if (bPlaySounds) {
      soundsSwitchButton.addClass('on');
      soundsSwitchButton.removeClass('off');
    }
    else {
      soundsSwitchButton.addClass('off');
      soundsSwitchButton.removeClass('on');
    }
  });
}

// Fonction appelée au clic sur le bouton startGameButton ou la touche ENTER
function runGame() {
  // On efface le menu...
  removeElements();

  // ... et on lance une partie de jeu
  startGame();
}

// Définie et affiche une pop-up avec les règles et crédits du jeu
function showInformationsPopUp() {
  infosPopUp = createDiv(
    "<h3>Règles du jeu</h3>" +
      "<p>Votre objectif est de permettre à <em>Marie la fourmi</em> de survivre le plus longtemps possible dans ce monde trop hostile pour cet insecte de petite taille.</p>" +
      "<p>De jour, comme de nuit, soyez attentifs !</p>" +
      "<p>De jour : à intervalle de temps variable, l’ombre du pied (ou de la main) d’un humain malveillant apparaît à l’écran et indique alors au joueur la zone à fuir au plus vite. Si la fourmi se trouve sous le pied (ou la main) de l’humain au moment où il (ou elle) touche le sol, c’est la mort assurée.</p>" +
      "<p>De nuit : un crapaud tapi dans la pénombre attend que la fourmi entre dans son champ de vision pour la manger. Avancez à tâtons pour localiser le danger et faire grimper votre score.</p>" +
      "<p>Commandes : <br/>Clic gauche : poser une graine <br/>ECHAP : quitter une partie en cours à tout moment. <br/>ESPACE : indique à Marie d'arrêter de manger et de fuir vers une autre graine en urgence.<br />'X' : fait apparaître une luciole dans la nuit pour aider Marie.</p>  " +
      "<h3>Crédits</h3>" +
      '<p><strong>Insecte-qui-peut!</strong> est un projet étudiant du M2 CIM (DT), développé par <strong>Matthieu Guillemin</strong> et <strong>Guillaume Hostache</strong>. \nOn remercie les livres "Drôles de petites bêtes" pour l\'inspiration :)</p>'
  );
  infosPopUp.addClass("infosPopUp");

  let okDiv = createDiv();
  okDiv.addClass("ok");
  okDiv.parent(infosPopUp);

  let okButton = createButton("OK");
  okButton.parent(okDiv);
  okButton.mousePressed(removeInfosPopUp);
}

function removeInfosPopUp() {
  if (infosPopUp) {
    infosPopUp.remove();
    infosPopUp = null;
  }
}

// Dessine l'accueil (menu) du jeu
function drawHomeScreen() {
  (bIsMobile) ? applyMobileStyle() : applyDesktopStyle();

  // Dégradé de couleur pour l'écran d'accueil (différent suivant le mode de jeu sélectionné)
  let exp = isNightMode ? 600 : 1000;

  let gradient = drawingContext.createLinearGradient(exp / 2, 0, exp / 2, exp);
  gradient.addColorStop(0.1, isNightMode ? color(44, 62, 80) : color(167, 201, 87));
  gradient.addColorStop(0.3, isNightMode ? color(58, 83, 105) : color(122, 158, 69));
  gradient.addColorStop(0.5, isNightMode ? color(78, 103, 124) : color(87, 116, 51));
  gradient.addColorStop(0.7, isNightMode ? color(94, 121, 146) : color(59, 81, 35));
  gradient.addColorStop(1, isNightMode ? color(115, 145, 175) : color(38, 52, 23));

  drawingContext.fillStyle = gradient;
  rect(0, 0, width, height);

  fill(isNightMode ? "#bdc3c7" : "#386641");
  circle(0, height, width / 4);
  circle(width, 0, width / 4);

  fill(isNightMode ? "#ffffff" : "#000000");

  // Titre du jeu
  textAlign(CENTER, CENTER);
  textSize(64);
  text("Insecte-qui-peut !", width / 2, height / 6);
}

function drawGameModeSelection() {

  modeButtonsDiv = createDiv();
  modeButtonsDiv.addClass("modeButtonsDiv");

  dayModeButton = createButton("Jour");
  dayModeButton.addClass("dayModeButton");
  dayModeButton.size(windowWidth / 6, 80);
  dayModeButton.position(windowWidth / 2 - dayModeButton.width - 40, height / 3);
  dayModeButton.mousePressed(() => {
    isNightMode = false;
    applyDayModeStyle();
  });

  nightModeButton = createButton("Nuit");
  nightModeButton.addClass("nightModeButton");
  nightModeButton.size(windowWidth / 6, 80);
  nightModeButton.position(windowWidth / 2 + 30, height / 3);
  nightModeButton.mousePressed(() => {
    isNightMode = true;
    applyNightModeStyle();
  });

  modeButtonsDiv.child(dayModeButton);
  modeButtonsDiv.child(nightModeButton);

}

function drawGameTimeSelection() {
  timerSlider = createSlider(0, 300, timer);
  timerSlider.addClass("timerSlider");
  timerSlider.size(windowWidth / 3, 15);
  timerSlider.position(windowWidth / 2 - timerSlider.width / 2, height / 3 + height / 4);

  gameTimerLabel = createDiv("");
  gameTimerLabel.addClass("gameTimerLabel");
  gameTimerLabel.position(timerSlider.x, timerSlider.y - 30);
}

function startGame() {
  /* Timeout de 100 ms, nécessaire pour éviter que le clique sur le bouton de lancement de jeu 
  soit considéré comme un clique qui dépose une première graine */
  setTimeout(() => {
    clearInterval(intervalTimer);
    // Initialisation du timer, tiens compte du mode infini
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
    bShowConfettis = false;
    humans = [];
    seeds = [];
    predators = [];
    fireflies = [];
    confettis = [];
    marie = new Marie(antImg, width / 2, height / 2, isNightMode ? nightCanvas : null);

    // Si une partie a été lancée en mode nuit, on lance la musique et les sons d'ambiance, et on libère un premier prédateur (crapaud)
    if (isNightMode) {
      if (bPlayMusics) playHorrorMusic();
      predators.push(new Predator(width / 8, height / 8, predatorImg));
    } else {
      if (bPlayMusics) playActionMusic();
    }
  }, 100);
}

// Affiche le score et le timer de la partie en cours
function drawGameInfo() {
  fill(!isNightMode ? "black" : "white");
  textSize(24);
  text(timer === -1 ? "∞" : timer, width / 2, height / 24);
  textSize(18);
  text("SCORE " + marie.score, width / 2, height / 10);

  // On est en mode mobile et on ajoute des boutons (pour remplacer les interactions clavier
  if (bIsMobile) {
    echapButton = createButton("Quitter");
    echapButton.addClass("echapButton");
    echapButton.size(width / 12, 60);
    echapButton.mousePressed(() => {
      if (bStartGame) newGame();
    });

    leakButton = createButton("Fuire");
    leakButton.addClass("leakButton");
    leakButton.size(width / 12, 60);
    leakButton.mousePressed(leakAction);

    if (isNightMode) {
      fireflyButton = createButton("Luciole");
      fireflyButton.addClass("fireflyButton");
      fireflyButton.size(width / 12, 60);
      fireflyButton.mousePressed(addNewFirefly);
    }
  }
}

function throwConfettis() {
  // On lance la musique en même temps que l'animation des confettis
  if (bPlayMusics) victoryJingle.play();
  bShowConfettis = true;
  for (let i = 0; i < 200; i++) {
    confettis.push(
        new Confetti(
            random(width),
            random(height / 2),
            random(5, 15),
            color(random(255), random(255), random(255)),
            confettisBackground
        )
    );
  }
}

function drawConfettis() {
  confettis.forEach((confetti, index) => {
    confetti.move();
    confetti.draw();

    // Supprimez les confettis qui sortent de l'écran
    if (confetti.isOffScreen()) {
      confettis.splice(index, 1);
    }
  });

  // Si tous les confettis ont disparu, désactivez l'animation
  if (confettis.length === 0) {
    bShowConfettis = false;
  }
}

// Réagit à la fin d'une partie (échec ou victoire) en affichant une pop-up récapitulative permettant de rejouer ou de quitter le jeu
function updateGameSituation() {
  /* 3 motifs d'arrêts :
  - Si le joueur a été écrasé (bGameOver)
  - Si la partie est terminé (temps limité)
  - Si la partie est infini, et que le joueur a été écrasé */

  if ((timer === -1 && bGameOver) || timer === 0 || bGameOver) {
    if (!bGameOver && timer === 0 && !bShowConfettis) throwConfettis();
    bGamePaused = true;
    let title, timeMessage, scoreMessage;
    if (timer >= 0) {
      title = bGameOver ? "Dommage, vous avez perdu..." : "Félicitations, vous avez réussi !";
      timeMessage = "Vous avez survécu pendant " + str(saveTimer - timer) + " secondes.";
      if (!bGameOver) {
        if (bPlayMusics) playActionMusic();
      } else {
        if (bPlayMusics) defeatJingle.play();
        if (bPlayMusics) stopAllMusics();
      }
    } else {
      title = "C'est terminé !";
      timeMessage = "Vous avez survécu pendant " + infinityTimer + " secondes.";
    }
    scoreMessage = "Votre score: " + marie.score;
    clearInterval(intervalTimer);
    drawEndGamePopUp(title, timeMessage, scoreMessage);
  }
}

// Pop-up de fin de jeu
function drawEndGamePopUp(title, timeMessage, scoreMessage) {
  endGamePopUp = createDiv("<h3>" + title + "</h3><p>" + timeMessage + "</p><p>" + scoreMessage + "</p>");
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

// Relance une partie identique à la précédente
function replayGame() {
  removeElements();
  bShowConfettis = false;
  clear();
  confettisBackground.clear();
  if (endGamePopUp) {
    endGamePopUp.remove();
    endGamePopUp = null;
  }
  startGame();
}

// Redirige vers l'écran d'accueil
function newGame() {
  timer = timerSlider.value();
  infinityTimer = 0;
  isNightMode = false;

  bStartGame = false;

  removeElements();
  if (endGamePopUp) endGamePopUp.remove();

  setup();
}

// A chaque clique/touche, on dépose une graine de taille aléatoire
function touchStarted() {
  if (bStartGame && !bGamePaused) {
    let seed = new Seed(mouseX, mouseY, Math.floor(Math.random() * 35) + 15, seedImg);

    /* Mode nuit, on ne peut poser les graines que dans le champ de vision de Marie
    ou dans le champ de vision des lucioles (plus dangereux pour le joueur) */
    if (isNightMode) {
      let touchInFireflyVision = false;

      // Distance entre la touche (graine) et marie
      let distanceToMarie = dist(marie.coordinate.x, marie.coordinate.y, mouseX, mouseY);

      // On définit aussi un angle pour les deux autres cercles qui font office de vision de l'insecte
      let angleToMouse = atan2(mouseY - marie.coordinate.y, mouseX - marie.coordinate.x);

      // Calcul de la différence
      let angleDiff = abs(angleToMouse - marie.currentAngle);
      if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;

      for (let f of fireflies) {
        if (dist(mouseX, mouseY, f.coordinate.x, f.coordinate.y) <= f.vision / 2) {
          touchInFireflyVision = true;
          break; // Stoppe la boucle dès qu'une condition est remplie
        }
      }

      /* Triple vérification : premier cercle, second cercle et dernier cercle de vision très approximatif */
      if (distanceToMarie < 40 ||
          (distanceToMarie >= 40 && distanceToMarie <= 100 && angleDiff < radians(60)) ||
          (distanceToMarie > 100 && distanceToMarie <= 125 && angleDiff < radians(30)) ||
          touchInFireflyVision)
      {
        seeds.push(seed);
      }

    } else {
      seeds.push(seed);
    }
  }
}

function keyPressed() {
  // Interaction clavier avec la touche ENTER pour lancer la partie
  if (!bStartGame && keyCode === ENTER) {
    runGame();
  }

  /* Interaction clavier avec la touche ESPACE pour permettre au joueur
  d'abandonner la graine courante pour un déplacement en urgence vers une autre graine (fuite) */
  if (keyCode === 32) {
    leakAction();
  }

  // Quitter le jeu en appuyant sur echap
  if (bStartGame && keyCode === ESCAPE) {
    newGame();
  }

  /* Interaction clavier avec la touche 'X' pour déposer une luciole qui éclaire pendant quelques secondes
  (on est limité à 7 lucioles à la fois) */
  if (keyCode === 88) {
    addNewFirefly();
  }
}

function leakAction() {
  if (bStartGame && marie != null && seeds != null) {
    marie.leakInPanic(seeds);
  }
}

function addNewFirefly() {
  if (bStartGame && isNightMode && fireflies.length < 7 && marie) {
    fireflies.push(new Firefly(marie.coordinate.x, marie.coordinate.y, nightCanvas));
  }
}

/* Boucle principale du jeu : Si le jeu n'a pas commencé, on dessine certains éléments 
et certaines animations de l'accueil. Quand la partie commence, on gère le jeu 
en fonction des paramètres de la partie. */
function draw() {
  if (!bStartGame) {
    // La partie n'est pas encore lancé
    drawHomeScreen();

    gameTimerLabel.html("Arriverez-vous à survivre pendant <strong>" + timerSlider.value() + "</strong> secondes...");

    if (timerSlider.value() === 0) {
      gameTimerLabel.html("Survivez le plus longtemps possible !");
    }

    return;
  }

  if (bGamePaused && !bShowConfettis) return;

  /* On dessine le fond (de jour comme de nuit)
  Hack bien sympathique, car ici, nos deux images de fond sont de même taille */
  for (let x = 0; x <= width; x += dayBackground.width) {
    for (let y = 0; y <= height; y += dayBackground.height) {
      image(!isNightMode ? dayBackground : nightBackground, x, y);
    }
  }

  // Dessiner les graines (toujours visibles)
  seeds.forEach((seed) => seed.draw());

  if (isNightMode) { // MODE NUIT
    // Nettoyer le canvas de nuit
    nightCanvas.clear();
    nightCanvas.fill(0);
    nightCanvas.rect(0, 0, width, height);

    // Dessiner la vision de Marie sur le calque de nuit
    marie.drawVision(nightCanvas);

    // Dessiner les grenouilles/prédateurs au-dessus de tout
    predators.forEach((p) => {
      p.draw(predatorImg);
      p.move();
      if (p.detectInsect(marie.coordinate.x, marie.coordinate.y) && !bShowConfettis) {
        if (bPlaySounds) swallowSoundEffect.play();
        bGameOver = true;
      }
    });

    /* Condition pour ajouter un prédateur :
    mode infini, ajout d'un predator toutes les 60 secondes (1800 frames) jusqu'à ce qu'il y ait 4 predateurs sur le terrain
    mode temps limité, ajout d'un predator toutes les 80 secondes (2400 frames), max 3 predateurs sur le terrain */
    if ((timer === -1 && frameCount % 3600 === 0 && predators.length < 4)
        || (infinityTimer === -1 && frameCount % 4800 === 0 && predators.length < 3))
    {
      predators.push(new Predator(width / 8, height / 8, predatorImg));
    }

    // Dessiner Marie de nuit (sous les lucioles)
    marie.draw()

    // Dessiner les lucioles et leurs effets sur le calque de nuit
    fireflies = fireflies.filter((f) => {
      f.drawVision();
      f.draw();
      f.move();
      return !f.isGone();
    });

    // Appliquer le calque de nuit
    image(nightCanvas, 0, 0);
  } else { // MODE JOUR
    // On génère une ombre d'ennemi (humain) toutes les 30 frames
    if (frameCount % 60 === 0) {
      let alea = Math.random();
      humans.push(new Human(random(0, width), random(150, height), alea > 0.5 ? humanFoot : humanHand));
    }

    let nbHumansBefore = humans.length;

    humans = humans.filter((h) => {
      h.draw();
      if (h.hWidth > 160) {
        if (h.detectInsect(marie.coordinate.x, marie.coordinate.y) && !bShowConfettis) {
          bGameOver = true;
        }
      }
      return h.hHeight < 220;
    });

    let nbHumansAfter = humans.length;

    for (let i = 0; i < nbHumansBefore - nbHumansAfter; i++) {
      if (bPlaySounds) footSmashSoundEffect.play();
    }

    marie.draw();
  }

  // Déplacer Marie et interagir avec les graines
  marie.think(seeds);
  marie.moveTowardTarget();

  drawGameInfo();
  updateGameSituation();

  if (bShowConfettis) {
    confettisBackground.background(0, 0, 0);
    confettisBackground.clear();
    drawConfettis();
    image(confettisBackground, 0, 0);
  }
}

function playHorrorMusic() {
  actionMusic.stop();
  if (!horrorMusic.isLooping() && !summerNightAmbiance.isLooping()) {
    horrorMusic.loop();
    summerNightAmbiance.loop();
  }
}

function playActionMusic() {
  horrorMusic.stop();
  summerNightAmbiance.stop();
  if (!actionMusic.isLooping()) actionMusic.loop();
}

function stopAllMusics() {
  horrorMusic.stop();
  summerNightAmbiance.stop();
  actionMusic.stop();
}

function applyMobileStyle() {
  musicsSwitchButton.addClass("mobile");
  soundsSwitchButton.addClass("mobile");
  infoButton.addClass("mobile");
  gameTimerLabel.addClass("mobile");
  timerSlider.addClass("mobile");
  modeButtonsDiv.addClass("mobile");
  dayModeButton.addClass("mobile");
  nightModeButton.addClass("mobile");
  startGameButton.addClass("mobile");
}

function applyDesktopStyle() {
  musicsSwitchButton.removeClass("mobile");
  soundsSwitchButton.removeClass("mobile");
  infoButton.removeClass("mobile");
  gameTimerLabel.removeClass("mobile");
  timerSlider.removeClass("mobile");
  modeButtonsDiv.removeClass("mobile");
  dayModeButton.removeClass("mobile");
  nightModeButton.removeClass("mobile");
  startGameButton.removeClass("mobile");
}

function applyDayModeStyle() {
  musicsSwitchButton.removeClass("nightMode");
  soundsSwitchButton.removeClass("nightMode");
  infoButton.removeClass("nightMode");
  gameTimerLabel.removeClass("nightMode");
  timerSlider.removeClass("nightMode");
  modeButtonsDiv.removeClass("nightMode");
  dayModeButton.removeClass("nightMode");
  nightModeButton.removeClass("nightMode");
  startGameButton.removeClass("nightMode");
}

function applyNightModeStyle() {
  musicsSwitchButton.addClass("nightMode");
  soundsSwitchButton.addClass("nightMode");
  infoButton.addClass("nightMode");
  gameTimerLabel.addClass("nightMode");
  timerSlider.addClass("nightMode");
  modeButtonsDiv.addClass("nightMode");
  dayModeButton.addClass("nightMode");
  nightModeButton.addClass("nightMode");
  startGameButton.addClass("nightMode");
}
