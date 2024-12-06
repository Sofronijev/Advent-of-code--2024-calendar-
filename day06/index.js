async function getMap() {
  const text = await fetchTextFile("./inputs/day6.txt");

  if (text) {
    return text.split("\n").map((row) => row.split(""));
  }
}

const GUARD = "^";
const BOX = "#";

const routePlan = [
  [-1, 0], //up
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
];

function getStartingPosition(map) {
  for (let row = 0; row < map.length; row++) {
    const column = map[row].indexOf(GUARD);
    if (column !== -1) {
      return [row, column];
    }
  }
}

function containsArray(arrays, newArray) {
  return arrays.some((arr) => JSON.stringify(arr) === JSON.stringify(newArray));
}

async function calculateRoute() {
  const map = await getMap();
  const start = getStartingPosition(map);

  let visited = new Set([JSON.stringify(start)]);
  let foundExit = false;
  let pathIndex = 0;
  let current = start;

  while (!foundExit) {
    const [x, y] = current;
    const [xPath, yPath] = routePlan[pathIndex];
    const [finalX, finalY] = [+x + xPath, +y + yPath];
    const finalLocation = map[finalX]?.[finalY];

    if (!finalLocation) {
      foundExit = true;
      break;
    }

    if (finalLocation === BOX) {
      pathIndex = (pathIndex + 1) % routePlan.length;
      continue;
    }
    current = [finalX, finalY];

    visited.add(JSON.stringify(current));
  }
  appendAnswerToDay(6, visited.size);
}

calculateRoute();
