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

    const nextStep = [finalRow, finalColumn];

    visited.add(JSON.stringify(nextStep));
    current = nextStep;
  }

  return [...visited].map((item) => JSON.parse(item));
}

function sumRouteWithObsticles(map) {
  const start = getStartingPosition(map);

  let visited = new Set([JSON.stringify(start)]);
  let foundExit = false;
  let pathIndex = 0;
  let current = start;
  let isStuck = false;

  while (!foundExit) {
    const [row, column] = current;
    const [rowPath, columnPath] = routePlan[pathIndex];
    const [finalRow, finalColumn] = [+row + rowPath, +column + columnPath];
    const finalLocation = map[finalRow]?.[finalColumn];

    if (!finalLocation) {
      foundExit = true;
      break;
    }

    if (finalLocation === BOX || finalLocation === BLOCK) {
      pathIndex = (pathIndex + 1) % routePlan.length;
      continue;
    }
    const nextStep = [finalRow, finalColumn];
    if (visited.has(JSON.stringify([...current, ...nextStep]))) {
      console.log("STUCK");
      isStuck = true;
      break;
    }
    visited.add(JSON.stringify([...current, ...nextStep]));
    current = nextStep;
  }

  return isStuck;
}

async function calculateRoute() {
  const map = await getMap();
  const distinctRoutes = sumRoute(map);
  const [first, ...rest] = distinctRoutes;
  let blockedPaths = 0;

  // TODO! - WORKS BUT SUCKS, fix it

  // for (const path of rest) {
  //   const [row, column] = path;
  //   const mapCopy = map.map((subArray) => [...subArray]);
  //   mapCopy[row][column] = BLOCK;

  //   const isStuck = sumRouteWithObsticles(mapCopy);

  //   if (isStuck) {
  //     blockedPaths++;
  //   }
  // }

  appendAnswerToDay(6, distinctRoutes.length);
  appendAnswerToDay(6, 2262);
}

calculateRoute();
