async function getMap() {
  const text = await fetchTextFile("./inputs/day6.txt");

  if (text) {
    return text.split("\n").map((row) => row.split(""));
  }
}

const GUARD = "^";
const BOX = "#";
const BLOCK = "X";

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

function sumRoute(map) {
  const start = getStartingPosition(map);

  let visited = new Set([JSON.stringify(start)]);
  let foundExit = false;
  let pathIndex = 0;
  let current = start;

  while (!foundExit) {
    const [row, column] = current;
    const [rowPath, columnPath] = routePlan[pathIndex];
    const [finalRow, finalColumn] = [+row + rowPath, +column + columnPath];
    const finalLocation = map[finalRow]?.[finalColumn];

    if (!finalLocation) {
      foundExit = true;
      break;
    }

    if (finalLocation === BOX) {
      pathIndex = (pathIndex + 1) % routePlan.length;
      continue;
    }

    current = [finalRow, finalColumn];

    visited.add(JSON.stringify(current));
  }

  return [...visited].map((item) => JSON.parse(item));
}

async function calculateRoute() {
  const map = await getMap();
  const distinctRoutes = sumRoute(map);

  appendAnswerToDay(6, distinctRoutes.length);
}

calculateRoute();
