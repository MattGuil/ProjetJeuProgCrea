class Bag {
  /*constructor() {
    this.isOpen = false;
    this.bagItems = []; 
    this.bagSize = 0;
  }*/

  constructor(pItems, pX, pY) {
    this.bagX = pX;
    this.bagY = pY;
    this.isOpen = false;
    this.bagItems = pItems;
    this.bagCount = this.bagItems.size;
  }

  draw() {
    fill(0, 0, 0);
    rect(this.bagX, this.bagY, 65, 65);
    if (this.isOpen) {
      console.log("On dessine ouvert");
    } else {
      console.log("on dessine fermé");
    }
  }

  addItem(pItem) {
    //console.log("addItem");
    this.bagItems.push(pItem);
    this.bagSize++;
  }

  openBag() {
    //console.log("openBag");
    this.isOpen = true;
  }

  closeBag() {
    //console.log("closeBag");
    this.isOpen = false;
  }
}
