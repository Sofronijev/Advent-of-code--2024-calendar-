async function day15() {
  const rules = {
    "#": "##",
    O: "[]",
    ".": "..",
    "@": "@.",
  };

  async function getData(transform = false) {
    const text = await fetchTextFile("./inputs/day15.txt");

    if (text) {
      const input = transform
        ? text
            .trim()
            .split("\n")
            .map((line) =>
              line
                .split("")
                .map((char) => rules[char] || char)
                .join("")
            )
            .join("\n")
        : text;

      const parts = input.split(/\n\s*\n/);

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
  const LEFT_BOX = "[";
  const RIGHT_BOX = "]";

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

  // movement of left and right part
  const nextBox = {
    [UP]: [-1, 0],
    [DOWN]: [1, 0],
    [LEFT]: [0, -2],
    [RIGHT]: [0, 2],
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

    console.table(result);
  }

  function moveBigBoxes(map, robotPosition, firstBoxPos, direction) {
    const block = map.get(firstBoxPos);
    const boxes = [];

    if (block === LEFT_BOX) {
      const rightBox = getNextBlock(firstBoxPos, 0, 1);
      boxes.push([firstBoxPos, rightBox]);
    } else if (block === RIGHT_BOX) {
      const leftBox = getNextBlock(firstBoxPos, 0, -1);
      boxes.push([leftBox, firstBoxPos]);
    }

    const [rowAdjustment, columnAdjustment] = nextBox[direction];
    const [robotRAjd, robotCAdj] = movement[direction];

    let hitWall = false;
    const isVertical = direction === UP || direction == DOWN;
    for (let i = 0; i < boxes.length; i++) {
      const lastPosition = boxes[i];
      const nextPosition1 = getNextBlock(lastPosition[0], rowAdjustment, columnAdjustment);
      const nextPosition2 = getNextBlock(lastPosition[1], rowAdjustment, columnAdjustment);

      const block1 = map.get(nextPosition1);
      const block2 = map.get(nextPosition2);

      if (block1 === WALL && block2 === WALL) {
        hitWall = true;
        break;
      }

      if (block1 === WALL || block2 === WALL) {
        if (isVertical) {
          hitWall = true;
        }
        break;
      }

      if (block1 === EMPTY && block2 === EMPTY) {
        continue;
      }

      if (block1 === LEFT_BOX && block2 === RIGHT_BOX) {
        boxes.push([nextPosition1, nextPosition2]);
        continue;
      }

      if (block1 === RIGHT_BOX && isVertical) {
        const left = getNextBlock(nextPosition1, 0, -1);
        boxes.push([left, nextPosition1]);
      }

      if (block2 === LEFT_BOX && isVertical) {
        const right = getNextBlock(nextPosition2, 0, 1);
        boxes.push([nextPosition2, right]);
      }
    }
    const setPosition = !hitWall;

    const rPos = getNextBlock(robotPosition, robotRAjd, robotCAdj);

    if (setPosition) {
      const boxesFlat = boxes.flat();
      for (let i = 0; i < boxesFlat.length; i++) {
        map.set(boxesFlat[i], EMPTY);
      }

      for (let i = 0; i < boxes.length; i++) {
        const [leftBox, rightBox] = boxes[i];

        map.set(getNextBlock(leftBox, robotRAjd, robotCAdj), LEFT_BOX);
        map.set(getNextBlock(rightBox, robotRAjd, robotCAdj), RIGHT_BOX);
      }
      map.set(robotPosition, EMPTY);
      map.set(rPos, ROBOT);
    }

    return !setPosition ? robotPosition : rPos;
  }

  function getNextBlock(location, rowAdj, columnAdj) {
    const [row, column] = location.split(",");
    return `${parseInt(row) + rowAdj},${parseInt(column) + columnAdj}`;
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

  async function getGPS(transform = false) {
    const { mapLayout, movementSequence, robotPosition } = await getData(transform);
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

      if (block === LEFT_BOX || block === RIGHT_BOX) {
        const robot = moveBigBoxes(mapLayout, robotPoss, possiblePosition, direction);
        robotPoss = robot;
      }

      if (block === BOX) {
        const robot = moveBoxes(mapLayout, robotPoss, possiblePosition, direction);
        robotPoss = robot;
      }
    }

    const searchValue = transform ? LEFT_BOX : BOX;
    return Array.from(mapLayout.entries())
      .filter(([, value]) => value === searchValue)
      .map(([key]) => key)
      .reduce((acc, key) => {
        const [row, column] = key.split(",");
        return acc + (100 * parseInt(row) + parseInt(column));
      }, 0);
  }

  const result1 = await getGPS();
  const result2 = await getGPS(true);

  appendAnswerToDay(15, result1);
  appendAnswerToDay(15, result2);
}
day15();
