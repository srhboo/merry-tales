// PubNub setup
let dataServer;
let pubKey = "";
let subKey = "";

let publisherId = ""; // reset to nothing

let view = "menu"; // reset to "menu"

// one user per direction
let fairyDirection = "left";

const yOriginOffset = 100;

let host = ""; //reset to ""
let players = []; // reset to empty array

let currentPositionX;
let currentPositionY;

let startButton;
let leftButton;
let rightButton;
let timer;
let mainText = "";
let startMenu;
let rulesMenu;
let enterName;
let nameInput;
let waiting;

let bg;
let menuBg;
let currImage; // reset to nothing
let dancer;
let scholar;
let fiddler;

const imageGif = {};
const images = [];
const assetPaths = {
  dancer: "assets/owlglass-crop.gif",
  scholar: "assets/scholar.gif",
  bird: "assets/bird.png",
  fiddle: "assets/fiddle.png",
  book: "assets/book.png",
  baby: "assets/baby.png",
  candle: "assets/candle.png",
  cartwheel: "assets/cartwheel.png",
  chair: "assets/chair.png",
  child: "assets/child.png",
  couple: "assets/couple.png",
  dish: "assets/dish.png",
  head: "assets/head.png",
  horse: "assets/horse.png",
  lady: "assets/lady.png",
  lamb1: "assets/lamb1.png",
  lamb2: "assets/lamb2.png",
  monkey: "assets/monkey.png",
  reading: "assets/reading.png",
  scoff: "assets/scoff.png",
  sleeping: "assets/sleeping.png",
  spin: "assets/spin.png",
  tea: "assets/tea.png",
  trap1: "assets/trap-1.png",
  bush: "assets/obstacle2-sm.png",
  ylfairy: "assets/yl-fairy.png",
  blfairy: "assets/bl-fairy.png",
  trap4: "assets/trap-1.png",
  bush1: "assets/obstacle2-sm.png",
  trap2: "assets/trap-1.png",
  bush2: "assets/obstacle2-sm.png",
  trap3: "assets/trap-1.png",
  bush3: "assets/obstacle2-sm.png",
  o: "assets/o.png",
  donkey: "assets/donkey.png",
  door: "assets/door.png",
  corner: "assets/corner.png",
  bear: "assets/bear.png",
};

let leftFairy;
let rightFairy;
let leftFairyName = "";
let rightFairyName = "";

function switchView(newView) {
  switch (newView) {
    case "name":
      startMenu.hide();
      view = "name";
      enterName.show();
      nameInput.show();
      break;
    case "game":
      enterName.hide();
      nameInput.hide();
      leftFairy.hide();
      rightFairy.hide();
      currImage.show();
      view = "game";
      break;
    default:
      break;
  }
}

function readIncoming(inMessage) {
  const { channel, message, timetoken } = inMessage;
  if (channel === "position") {
    const { x = currentPositionX, y = currentPositionY } = message;
    currentPositionX = x;
    currentPositionY = y;
  }
  if (channel === "game events") {
    const { event } = message;
    if (event === "start") {
      switchView("game");
      startRound();
    } else if (event === "join") {
      const { userId } = message;
      if (userId !== publisherId && publisherId) {
        sendPlayers([userId, publisherId]);
      } else {
        host = publisherId;
        leftFairyName = publisherId;
      }
      sendStart();
    } else if (event === "full house") {
      const { userId, players } = message;
      host = userId;
      const amIHost = host === publisherId;
      const otherPlayer = players.filter((name) => name !== publisherId)[0];
      fairyDirection = amIHost ? "left" : "right";
      leftFairyName = amIHost ? publisherId : otherPlayer;
      rightFairyName = amIHost ? otherPlayer : publisherId;
    } else if (event === "drop") {
      const { imageName, height } = message;
      const assPath = assetPaths[imageName];
      currImage = createImg(assPath, imageName);
      resetPosition();
    }
  }
}

function preload() {
  menuBg = loadImage("assets/st-menu.png");
}

function setup() {
  fetch("/env.json")
    .then((data) => data.json())
    .then(({ PUB_KEY, SUB_KEY }) => {
      pubKey = PUB_KEY;
      subKey = SUB_KEY;

      // initialize PubNub
      dataServer = new PubNub({
        publish_key: pubKey,
        subscribe_key: subKey,
        ssl: true,
        uuid: publisherId,
      });

      dataServer.addListener({
        message: readIncoming,
      });
      dataServer.subscribe({
        channels: ["game events", "position"],
      });
    });
  characterBg = loadImage("assets/st-name.png");
  bg = loadImage("assets/woods.png");

  createCanvas(848, 848);
  frameRate(15);

  dancer = createImg("assets/owlglass-crop.gif", "dancer");
  dancer.attribute("height", 150);
  dancer.hide();
  currImage = dancer;

  leftFairy = createImg("assets/bl-fairy.png", "left fairy");
  leftFairy.attribute("height", 90);
  leftFairy.hide();

  rightFairy = createImg("assets/yl-fairy.png", "right fairy");
  rightFairy.attribute("height", 90);
  rightFairy.hide();

  currentPositionX = width / 2;
  currentPositionY = height - yOriginOffset;

  textSize(40);
  textAlign(CENTER, CENTER);

  startMenu = createDiv(" ");
  startMenu.class("menu start");
  startMenu.mousePressed(() => switchView("name"));

  nameInput = createInput("");
  nameInput.class("name");
  nameInput.attribute("maxlength", 15);
  nameInput.hide();

  enterName = createDiv(" ");
  enterName.class("menu name");
  enterName.mousePressed(sendJoin);
  enterName.hide();

  window.onbeforeunload = function () {
    dataServer.unsubscribeAll();
    return null;
  };
}

function draw() {
  switch (view) {
    case "menu":
      background(menuBg);
      break;
    case "name":
      background(characterBg);
      break;
    case "game":
      background(bg);
      fill(255);
      textFont("Courier");
      text(leftFairyName, 100, 100);
      text(rightFairyName, 748, 100);
      currImage.position(
        currentPositionX - currImage.width / 2,
        currentPositionY - currImage.height / 2
      );
      break;
    default:
      break;
  }
}
