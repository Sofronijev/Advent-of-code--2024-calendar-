async function getAntennasMap() {
  const text = await fetchTextFile("./inputs/day8.txt");

  const map = text
    .replace(/\r/g, "")
    .trim()
    .split("\n")
    .map((row) => row.split(""));

  const locations = map.reduce((acc, row, rowIndex) => {
    row.forEach((item, colIndex) => {
      if (item !== EMPTY) {
        const location = `${rowIndex}-${colIndex}`;
        acc[item] = acc[item] ? [...acc[item], location] : [location];
      }
    });
    return acc;
  }, {});

  return { map, locations };
}

const EMPTY = ".";

function calculateXLocation(x1, x2, distanceX) {
  return x2 < x1 ? x1 + distanceX : x1 - distanceX;
}

function calculateYLocation(y1, y2, distanceY) {
  return y2 < y1 ? y1 + distanceY : y1 - distanceY;
}

function getNodesLoc(antennaLoc, map) {
  let nodeLocations1 = [];
  let nodeLocations2 = [];

  function recursion(i, antennaLoc, slate1, slate2) {
    if (i >= antennaLoc.length - 1) {
      nodeLocations1.push(...slate1.slice());
      nodeLocations2.push(...slate2.slice());
      return;
    }

    for (let j = i + 1; j < antennaLoc.length; j++) {
      const item1 = antennaLoc[i];
      const item2 = antennaLoc[j];

      const [x1, y1] = item1.split("-").map(Number);
      const [x2, y2] = item2.split("-").map(Number);

      const distanceX = Math.abs(x1 - x2);
      const distanceY = Math.abs(y1 - y2);

      let nodeX1Location = calculateXLocation(x1, x2, distanceX);
      let nodeY1Location = calculateYLocation(y1, y2, distanceY);

      let nodeX2Location = calculateXLocation(x2, x1, distanceX);
      let nodeY2Location = calculateYLocation(y2, y1, distanceY);

      // PART 1 --------------------------------------------------------
      const charAt1 = map[nodeX1Location]?.[nodeY1Location];
      const charAt2 = map[nodeX2Location]?.[nodeY2Location];

      if (charAt1) {
        slate1.push(`${nodeX1Location}-${nodeY1Location}`);
      }

      if (charAt2) {
        slate1.push(`${nodeX2Location}-${nodeY2Location}`);
      }
      // PART 1 --------------------------------------------------------

      // PART 2 --------------------------------------------------------
      if (item1) {
        slate2.push(item1);
      }

      if (item2) {
        slate2.push(item2);
      }

      for (let iteration = 1; ; iteration++) {
        nodeX1Location = calculateXLocation(x1, x2, distanceX * iteration);
        nodeY1Location = calculateYLocation(y1, y2, distanceY * iteration);

        if (!map[nodeX1Location]?.[nodeY1Location]) break; // Exit loop if condition is not met

        slate2.push(`${nodeX1Location}-${nodeY1Location}`);
      }

      for (let iteration = 1; ; iteration++) {
        nodeX2Location = calculateXLocation(x2, x1, distanceX * iteration);
        nodeY2Location = calculateYLocation(y2, y1, distanceY * iteration);

        if (!map[nodeX2Location]?.[nodeY2Location]) break; // Exit loop if condition is not met

        slate2.push(`${nodeX2Location}-${nodeY2Location}`);
      }
      // PART 2 --------------------------------------------------------
    }

    recursion(i + 1, antennaLoc, slate1, slate2);
  }

  recursion(0, antennaLoc, [], []);
  return [nodeLocations1, nodeLocations2];
}

async function getAntinodes() {
  const { map, locations } = await getAntennasMap();

  const antennaValues = Object.keys(locations);

  const { part1, part2 } = antennaValues.reduce(
    (acc, value) => {
      const antennaLoc = locations[value];
      const [part1, part2] = getNodesLoc(antennaLoc, map);
      acc.part1.push(...part1);
      acc.part2.push(...part2);
      return acc;
    },
    { part1: [], part2: [] }
  );

  appendAnswerToDay(8, new Set(part1).size);
  appendAnswerToDay(8, new Set(part2).size);
}

getAntinodes();
