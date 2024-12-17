async function getData() {
  const text = await fetchTextFile("./inputs/day12.txt");

  if (text) {
    return text
      .replace(/\n/g, "")
      .split("\r")
      .map((item) => item.split(""));
  }
}

function calcAreaAndPerimeter(map) {
  const visitedGrid = map.map((row) => row.map(() => false));

  const result = [];
  const path = {
    up: [-1, 0],
    right: [0, 1],
    down: [1, 0],
    left: [0, -1],
  };
  function BreadthFirstSearch(row, column) {
    const type = map[row]?.[column];
    let area = 0;
    let perimeter = 0;
    const query = [{ row, column }];

    while (query.length) {
      const plot = query.shift();

      if (visitedGrid[plot.row]?.[plot.column]) {
        continue;
      }

      visitedGrid[plot.row][plot.column] = true;
      area++;

      for (const [x, y] of Object.values(path)) {
        const newRow = plot.row + x;
        const newColumn = plot.column + y;
        const nextItem = map[newRow]?.[newColumn];
        // check if next item is same type, this covers if next item is out of bounds
        if (type === nextItem) {
          if (!visitedGrid[newRow]?.[newColumn]) {
            query.push({ row: newRow, column: newColumn });
          }
        } else {
          perimeter++;
        }
      }
    }

    return { type, area, perimeter };
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

  appendAnswerToDay(12, result);
}

calculateFarm();
