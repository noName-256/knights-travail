const body = document.querySelector("body");
const placeKnightButton = document.querySelector("button.place-knight");
const selectDestinationButton = document.querySelector(
  "button.select-destination"
);
const startButton = document.querySelector("button.start");
const clearButton = document.querySelector("button.clear");
const allTiles = document.querySelectorAll(".tiles .tile");
const knight = document.querySelector(".knight");
const destination = document.querySelector(".destination");
let knightX = null,
  knightY = null,
  destinationX = null,
  destinationY = null;
const chessMoveAudio = new Audio("./chess-move.mp3");
const loudChessMoveAudio = new Audio("./chess-move-loud.mp3");
const drawAudio = new Audio("./draw.mp3");
let gettingKnightPath = false;
function playChessMoveAudio() {
  chessMoveAudio.play();
}
function playLoudChessMoveAudio() {
  loudChessMoveAudio.play();
}
function playDrawAudio() {
  drawAudio.play();
}
function clearKnight() {
  knightX = null;
  destinationX = null;
  knight.classList.remove("show");
}
function clearDestination() {
  knightY = null;
  destinationX = null;
  destinationY = null;
  destination.classList.remove("show");
}
function stopPlacingAnything() {
  body.classList.remove("place-knight");
  body.classList.remove("place-destination");
}
function clearHighlights() {
  allTiles.forEach((tile) => {
    tile.classList.remove("highlight");
  });
}
function startPlacingKnight() {
  body.classList.remove("place-destination");
  body.classList.add("place-knight");
}
function startPlacingDestination() {
  body.classList.remove("place-knight");
  body.classList.add("place-destination");
}
function knightAnimation(nextTiles) {
  const nextTile = nextTiles[0],
    xy = tileToXY(nextTile);
  knight.style.setProperty("--x-position", xy.x);
  knight.style.setProperty("--y-position", xy.y);
  nextTiles.shift();
  if (nextTiles.length > 0) {
    setTimeout(() => knightAnimation(nextTiles), 600);
    if (nextTiles.length > 1)
      // if not last move then play normal audio
      setTimeout(playChessMoveAudio, 600);
    else setTimeout(playLoudChessMoveAudio, 600); // otherwise play the loud one
  } else {
    clearDestination();
    // set new knight x and y
    knightX = xy.x;
    knightY = xy.y;
    // allow new start
    gettingKnightPath = false;
  }
  setTimeout(() => {
    // remove next tile highlight
    const nextTileElement = document.querySelector(`.tiles .tile-${nextTile}`);
    nextTileElement.classList.remove("highlight");
  });
}
function startKnightsTravail() {
  stopPlacingAnything();
  // if knight and destination chosen start knights travail
  if (knightX !== null && destinationX !== null && !gettingKnightPath) {
    gettingKnightPath = true;
    const path = getKnightPath();
    path.forEach((tileNumber) => {
      const tileElement = document.querySelector(`.tiles .tile-${tileNumber}`);
      tileElement.classList.add("highlight");
    });
    setTimeout(700, knightAnimation(path));
  }
}
function clear() {
  stopPlacingAnything();
  clearKnight();
  clearDestination();
  clearHighlights();
}
function xyToTile(x, y) {
  // if invalid coordinates return null
  if (x < 1 || x > 8 || y < 1 || y > 8) return null;
  // returns tile number if we know x and y
  return (y - 1) * 8 + x;
}
function tileToXY(tile) {
  //returns x and y if we know tile number
  return {
    x: tile % 8 === 0 ? 8 : tile % 8,
    y: Math.floor((tile - 1) / 8) + 1,
  };
}
function clickTile(event) {
  const tile = event.target;
  const placingKnight = body.classList.contains("place-knight"),
    placingDestination = body.classList.contains("place-destination");

  const numberRegex = /\d/;
  const tileNumber = tile.className.slice(tile.className.search(numberRegex));
  const tileXY = tileToXY(tileNumber);

  if (placingKnight) {
    playChessMoveAudio();
    clearHighlights();
    knightX = tileXY.x;
    knightY = tileXY.y;
    knight.style.setProperty("--x-position", knightX);
    knight.style.setProperty("--y-position", knightY);
    if (!knight.classList.contains("show")) knight.classList.add("show");
    body.classList.remove("place-knight");
  } else if (placingDestination) {
    playDrawAudio();
    clearHighlights();
    destinationX = tileXY.x;
    destinationY = tileXY.y;
    destination.style.setProperty("--x-position", destinationX);
    destination.style.setProperty("--y-position", destinationY);
    if (!destination.classList.contains("show"))
      destination.classList.add("show");
    body.classList.remove("place-destination");
  }
}
function getKnightPath() {
  // returns an array of tile numbers representing
  // the shortest path from knight to destination
  const passedTiles = {};
  const startingTile = xyToTile(knightX, knightY);
  const queue = [];
  queue.push({
    tile: startingTile,
    path: [startingTile],
  });
  while (queue) {
    const element = queue[0];
    const xy = tileToXY(element.tile),
      path = element.path;
    queue.shift();
    if (element.tile === null) continue; // if invalid tile skip it
    if (passedTiles[element.tile]) continue; // if passed this tile already skip it
    // if tile is destination then we found the shortest path
    if (xy.x === destinationX && xy.y === destinationY) return path;

    // add new paths
    let newTile;
    newTile = xyToTile(xy.x + 1, xy.y + 2);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x + 1, xy.y - 2);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x - 1, xy.y + 2);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x - 1, xy.y - 2);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x + 2, xy.y + 1);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x + 2, xy.y - 1);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x - 2, xy.y + 1);
    queue.push({ tile: newTile, path: [...path, newTile] });
    newTile = xyToTile(xy.x - 2, xy.y - 1);
    queue.push({ tile: newTile, path: [...path, newTile] });
  }
  // could not find any path
  throw new Error("Cannot find knight path???");
  return false;
}
placeKnightButton.addEventListener("click", startPlacingKnight);
selectDestinationButton.addEventListener("click", startPlacingDestination);
startButton.addEventListener("click", startKnightsTravail);
clearButton.addEventListener("click", clear);
allTiles.forEach((tile) => tile.addEventListener("click", clickTile));
