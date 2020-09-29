function startRound() {
  currentPositionX = width/2;
  currentPositionY = height - yOriginOffset;
  if(host === publisherId) {
    if(timer) clearInterval(timer);
    timer = setInterval(goForward, 1000);
  }
}

function sendDirection(direction) {
  let newX;
  if(direction === "left"){
    const check = currentPositionX - 20;
    newX = check < 0 ? 50 : check;
  } else if(direction === "right") {
    const check = currentPositionX + 20;
    newX = check > width ? width - 50: check;
  }
  dataServer.publish({
    channel: "position",
    message: {x: newX}
  });
}

function resetPosition() {
  dataServer.publish({
    channel: "position",
    message: {x: width/2, y: height - yOriginOffset}
  });
}


function sendStart() {
  dataServer.publish({
    channel: "game events",
    message: {userId: publisherId, event: "start"}
  });
}

function sendJoin() {
  const name = nameInput.value();
  publisherId = name;
  dataServer.publish({
    channel: "game events",
    message: {userId: name, event: "join"}
  });
}

function sendPlayers(players) {
  dataServer.publish({
    channel: "game events",
    message: {userId: publisherId, event: "full house", players}
  });
}

function goForward() {
  const check = currentPositionY - 40;
  const newY = check < 0 ? height : check;
  dataServer.publish({
    channel: "position",
    message: {y: newY}
  });
}

function showFairy(direction, x = 100, y = 700) {
  if(direction === "left") {
    leftFairy.position(x, y);
    leftFairy.show();
  } else if(direction === "right") {
    rightFairy.position(x, y);
    rightFairy.show();
  }
}

function hideFairy(direction) {
  if(direction === "left") {
    leftFairy.hide();
  } else if(direction === "right") {
    rightFairy.hide();
  }
}

function pickImage() {
  const names = Object.keys(assetPaths);
  const rand = Math.floor(Math.random() * Math.floor(names.length));
  return names[rand];
}

function sendDrop() {
  const newImage = pickImage();
  dataServer.publish({
    channel: "game events",
    message: {event: "drop", imageName: newImage}
  });
}

function keyPressed() {
  if(keyCode === 32) {
    if(fairyDirection === "left") {
      sendDirection("left");
    } else if(fairyDirection === "right") {
      sendDirection("right");
    }
  } else if(keyCode === 67) {
    sendDrop();
  }
}