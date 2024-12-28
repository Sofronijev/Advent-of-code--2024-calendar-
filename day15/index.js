function day15() {
  async function getData() {
    const text = await fetchTextFile("./inputs/day15.txt");

    if (text) {
      const parts = text.split(/\n\s*\n/);

      const locationMap = new Map();
      const rows = parts[0].replace(/\r/g, "").split("\n");
      let robotPosition = "";

      rows.forEach((row, rowIndex) => {
        row.split("").forEach((value, colIndex) => {
          locationMap.set(`${rowIndex},${colIndex}`, value);
        });
      });

      for (const [key, value] of locationMap.entries()) {
        if (value === ROBOT) {
          robotPosition = key;
        }
      }

      return {
        mapLayout: locationMap,
        movementSequence: parts[1].trim().replace(/\s+/g, ""),
        robotPosition,
      };
    }
  }

  const WALL = "#";
  const BOX = "O";
  const ROBOT = "@";
  const EMPTY = ".";
  const UP = "^";
  const DOWN = "v";
  const LEFT = "<";
  const RIGHT = ">";

  const movement = {
    [UP]: [-1, 0],
    [DOWN]: [1, 0],
    [LEFT]: [0, -1],
    [RIGHT]: [0, 1],
  };

  function printMap(map) {
    const rows = Math.max(...[...map.keys()].map((k) => parseInt(k.split(",")[0]))) + 1;
    const cols = Math.max(...[...map.keys()].map((k) => parseInt(k.split(",")[1]))) + 1;

    // Create a 2D array filled with null
    const result = Array.from({ length: rows }, () => Array(cols).fill(null));

    // Populate the 2D array from the Map
    for (const [key, value] of map) {
      const [row, col] = key.split(",").map(Number);
      result[row][col] = value;
    }

    console.log(result);
  }

  function moveBoxes(map, robotPosition, firstBoxPos, direction) {
    const [rowAdjustment, columnAdjustment] = movement[direction];
    let hitWall = false;
    let lastPosition = firstBoxPos;
    let emptyBlock = null;

    while (!emptyBlock || !hitWall) {
      const [positionRow, positionColumn] = lastPosition.split(",");
      const nextPosition = `${parseInt(positionRow) + rowAdjustment},${
        parseInt(positionColumn) + columnAdjustment
      }`;
      const block = map.get(nextPosition);
      // printMap(map);

      if (block === EMPTY) {
        emptyBlock = nextPosition;
        break;
      }

      if (block === BOX) {
        lastPosition = nextPosition;
        continue;
      }

      if (block === WALL) {
        hitWall = true;
        break;
      }

      if (block === ROBOT) {
        break;
      }
    }

    const setPosition = !hitWall && emptyBlock;

    if (!hitWall && emptyBlock) {
      // set robot position to empty
      map.set(robotPosition, EMPTY);
      // set empty place to box
      map.set(emptyBlock, BOX);
      // put robot to first position of box
      map.set(firstBoxPos, ROBOT);
    }

    return !setPosition ? robotPosition : firstBoxPos;
  }

  async function getGPS() {
    const { mapLayout, movementSequence, robotPosition } = await getData();
    let robotPoss = robotPosition;
    for (let i = 0; i < movementSequence.length; i++) {
      const direction = movementSequence[i];

      const [rowAdjustment, columnAdjustment] = movement[direction];
      const [robotRow, robotColumn] = robotPoss.split(",");
      const possiblePosition = `${parseInt(robotRow) + rowAdjustment},${
        parseInt(robotColumn) + columnAdjustment
      }`;
      const block = mapLayout.get(possiblePosition);
      if (block === EMPTY) {
        mapLayout.set(possiblePosition, ROBOT);
        mapLayout.set(robotPoss, EMPTY);
        robotPoss = possiblePosition;
        continue;
      }

      if (block === WALL) {
        continue;
      }

      if (block === BOX) {
        const robot = moveBoxes(mapLayout, robotPoss, possiblePosition, direction);
        robotPoss = robot;
      }
    }

    const boxes = Array.from(mapLayout.entries())
      .filter(([, value]) => value === "O")
      .map(([key]) => key)
      .reduce((acc, key) => {
        const [row, column] = key.split(",");

        return acc + (100 * parseInt(row) + parseInt(column));
      }, 0);


    appendAnswerToDay(15, boxes);
  }
  getGPS();
}
day15();
