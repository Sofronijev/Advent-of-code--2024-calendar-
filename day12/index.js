async function getData() {
  const text = await fetchTextFile("./inputs/day12.txt");

  if (text) {
    return text
      .replace(/\n/g, "")
      .split("\r")
      .map((item) => item.split(""));
  }
}

function calcCornerNum(sides, map, plot, type) {
  // Check if there is an angle of the item
  const upRight = sides.up && sides.right;
  const upLeft = sides.up && sides.left;
  const downRight = sides.down && sides.right;
  const downLeft = sides.down && sides.left;

  // Check if there are items of the same type diagonal from item
  const diagonalUpLeft = map[plot.row - 1]?.[plot.column - 1] === type;
  const diagonalUpRight = map[plot.row - 1]?.[plot.column + 1] === type;
  const diagonalDownLeft = map[plot.row + 1]?.[plot.column - 1] === type;
  const diagonalDownRight = map[plot.row + 1]?.[plot.column + 1] === type;

  // If two sides are same type, but diagonal is not that is an inner corner
  //C <- this one (inner)
  //CC
  const topRightInnerCorner = !sides.up && !sides.right && !diagonalUpRight;
  const topLeftInnerCorner = !sides.up && !sides.left && !diagonalUpLeft;
  const bottomRightInnerCorner = !sides.down && !sides.right && !diagonalDownRight;
  const bottomLeftInnerCorner = !sides.down && !sides.left && !diagonalDownLeft;

  return [
    upRight,
    upLeft,
    downRight,
    downLeft,
    topRightInnerCorner,
    topLeftInnerCorner,
    bottomRightInnerCorner,
    bottomLeftInnerCorner,
  ].filter(Boolean).length;
}

function calcAreaAndPerimeter(map) {
  const visitedGrid = map.map((row) => row.map(() => false));

  const result = [];
  const path = [
    { name: "up", x: -1, y: 0 },
    { name: "right", x: 0, y: 1 },
    { name: "down", x: 1, y: 0 },
    { name: "left", x: 0, y: -1 },
  ];
  function BreadthFirstSearch(row, column) {
    const type = map[row]?.[column];
    let area = 0;
    let perimeter = 0;
    let corners = 0;

    const query = [{ row, column }];

    while (query.length) {
      const plot = query.shift();
      const sides = {};

      if (visitedGrid[plot.row]?.[plot.column]) {
        continue;
      }

      visitedGrid[plot.row][plot.column] = true;
      area++;

      for (const { name, x, y } of path) {
        const newRow = plot.row + x;
        const newColumn = plot.column + y;
        const nextItem = map[newRow]?.[newColumn];

        if (nextItem !== type) {
          perimeter++;
          sides[name] = true;
        } else if (!visitedGrid[newRow]?.[newColumn]) {
          query.push({ row: newRow, column: newColumn });
        }
      }
      const cornerNum = calcCornerNum(sides, map, plot, type);
      corners += cornerNum;
    }

    return { type, area, perimeter, corners };
  }

  for (let row = 0; row < visitedGrid.length; row++) {
    for (let column = 0; column < visitedGrid[row].length; column++) {
      if (!visitedGrid[row][column]) {
        result.push(BreadthFirstSearch(row, column));
      }
    }
  }
  return result;
}

async function calculateFarm() {
  const map = await getData();

  const gardenData = calcAreaAndPerimeter(map);
  const result = gardenData.reduce((acc, item) => {
    return acc + item.area * item.perimeter;
  }, 0);

  const result2 = gardenData.reduce((acc, item) => {
    return acc + item.area * item.corners;
  }, 0);

  appendAnswerToDay(12, result);
  appendAnswerToDay(12, result2);
}

calculateFarm();
