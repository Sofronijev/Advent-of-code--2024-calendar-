async function getMap() {
  const text = await fetchTextFile("./inputs/day10.txt");

  if (text) {
    return text
      .replace(/\r/g, "")
      .split("\n")
      .map((row) => row.split("").map((item) => Number(item)));
  }
}

const path = {
  up: [-1, 0],
  right: [0, 1],
  down: [1, 0],
  left: [0, -1],
};

function calculateTrails(map, rowStart, columnStart, unique = false) {
  let trailNum = 0;
  function recursion(index, row, column, slate) {
    if (index === 9) {
      trailNum++;
      if (unique) {
        return;
      }
    }

    if (index < 9) {
      for (const [x, y] of Object.values(path)) {
        if (
          map[row + x]?.[column + y] === index + 1 &&
          !slate.includes(`${row + x}-${column + y}`)
        ) {
          slate.push(`${row + x}-${column + y}`);
          recursion(index + 1, row + x, column + y, slate);
        }
      }
    }
    !unique && slate.pop();
  }

  recursion(0, rowStart, columnStart, []);
  return trailNum;
}

function getAllTrails(map) {
  let uniqueTrailsNum = 0;
  let trailsNum = 0;

  for (let i = 0; i < map.length; i++) {
    const trailRow = map[i];
    for (let k = 0; k < trailRow.length; k++) {
      const trailNum = trailRow[k];
      if (trailNum === 0) {
        const trailsUnique = calculateTrails(map, i, k, true);
        const trails = calculateTrails(map, i, k);
        uniqueTrailsNum += trailsUnique;
        trailsNum += trails;
      }
    }
  }

  return [uniqueTrailsNum, trailsNum];
}

async function getTrails() {
  const map = await getMap();
  const trails = getAllTrails(map);
  appendAnswerToDay(10, trails[0]);
  appendAnswerToDay(10, trails[1]);
}

getTrails();
