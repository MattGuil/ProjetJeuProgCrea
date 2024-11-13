let timer;
let marie;
let bag;

let seeds = [];

let humans = [];
let bGameOver = false;

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
    humans.push(new Human(random(50, width-50), random(50, height-50)));
  }


  humans = humans.filter(h => {
    //console.log(h.x, h.y, h.radius);
    h.draw();
    return h.radius < 150;
  });

  // fin de partie
  if ((timer === 0) || (bGameOver)) {
    //console.log("fin de partie");
    noLoop();
    exit();
  }

  fill(0, 0, 0);
  text(timer, 100, 100);

  marie.lookForClosestSeed(seeds);
  marie.moveTowardTarget();

  seeds.forEach(seed => seed.draw());

  marie.draw();

  bag.draw();
}

function startGame() {
  timer = 60;
  marie = new Marie(width / 2, height / 2);
  bag = new Bag([], 25, windowHeight - 90);
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
    seeds.push(new Seed(mouseX, mouseY));
  }
}
