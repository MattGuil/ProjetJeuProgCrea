let timer;
let marie;
let bag;
let seeds;
let humans;
let bGameOver;

function setup() {
  frameRate(30); // 30 FPS
  createCanvas(windowWidth, windowHeight);
  noStroke();

  startGame();
  setInterval(() => {
    timer--;
  }, 1000);
}

function draw() {
  background("#ccd5ae");
  // ajout d'une ombre toutes les 5 secondes
  if (frameCount % 60 === 0 ) { // 1 pieds toutes les deux secondes (60 Frames, 30FPS)
    humans.push(new Human(random(100, width-100), random(200, height-150)));
  }

  humans = humans.filter(h => {
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
  if ((timer === 0) || (bGameOver)) {
    console.log("fin de partie");
    console.log("SCORE = ", marie.score);
    if (!bGameOver) {
      console.log("Bravo, vous ne vous êtes pas fait écrasé !");
    } else {
      console.log("Dommage, il vous restait " + timer + "secondes à tenir");
    }
    startGame();
  }

  fill(0, 0, 0);
  text(timer, 50, 100);

  marie.lookForClosestSeed(seeds);
  marie.moveTowardTarget();

  seeds.forEach(seed => seed.draw());

  marie.draw();

  bag.draw();
}

function startGame() {
  timer = 60;
  humans = [];
  seeds = [];
  marie = new Marie(width / 2, height / 2);
  bag = new Bag([], 25, windowHeight - 90);
  bGameOver = false;
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
  } else {
    // Drop a seed
    seeds.push(new Seed(mouseX, mouseY, 5));
  }
}
