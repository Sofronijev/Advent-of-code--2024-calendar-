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

function getNodesLoc(antennaLoc, map) {
  let nodeLocations = [];

  function recursion(i, antennaLoc, slate) {
    if (i >= antennaLoc.length - 1) {
      nodeLocations.push(...slate.slice());
      return;
    }

    for (let j = i + 1; j < antennaLoc.length; j++) {
      const item1 = antennaLoc[i];
      const item2 = antennaLoc[j];

      const [x1, y1] = item1.split("-").map(Number);
      const [x2, y2] = item2.split("-").map(Number);

      const distanceX = Math.abs(x1 - x2);
      const distanceY = Math.abs(y1 - y2);

      const nodeX1Location = x2 < x1 ? x1 + distanceX : x1 - distanceX;
      const nodeY1Location = y2 < y1 ? y1 + distanceY : y1 - distanceY;

      const nodeX2Location = x2 > x1 ? x2 + distanceX : x2 - distanceX;
      const nodeY2Location = y2 > y1 ? y2 + distanceY : y2 - distanceY;

      const charAt1 = map[nodeX1Location]?.[nodeY1Location];
      const charAt2 = map[nodeX2Location]?.[nodeY2Location];

      if (charAt1) {
        slate.push(`${nodeX1Location}-${nodeY1Location}`);
      }

      if (charAt2) {
        slate.push(`${nodeX2Location}-${nodeY2Location}`);
      }
    }

    recursion(i + 1, antennaLoc, slate);
  }

  recursion(0, antennaLoc, []);
  return nodeLocations;
}

async function getAntinodes() {
  const { map, locations } = await getAntennasMap();

  const antennaValues = Object.keys(locations);

  const allLocations = antennaValues.reduce((acc, value) => {
    const antennaLoc = locations[value];
    const nodeLocations = getNodesLoc(antennaLoc, map);
    acc.push(...nodeLocations);
    return acc;
  }, []);

  appendAnswerToDay(8, new Set(allLocations).size);
}

getAntinodes();
