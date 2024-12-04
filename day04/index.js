async function getWords() {
  const text = await fetchTextFile("./inputs/day4.txt");
  if (text) {
    return text
      .trim()
      .split("\n")
      .map((row) => row.split(""));
  }
}

const xmas = "XMAS";

async function findXmas() {
  const words = await getWords();
  let count = 0;
  
  for (let row = 0; row < words.length; row++) {
    const lettersRow = words[row];
    for (let column = 0; column < lettersRow.length; column++) {
      const letter = lettersRow[column];
      if (letter === "X") {
        const directions = [
          [0, 1],
          [0, -1], // Horizontal
          [-1, 0],
          [1, 0], // Vertical
          [1, 1],
          [-1, 1], // Diagonal Right
          [1, -1],
          [-1, -1], // Diagonal Left
        ];

        const calculateXmasSum = directions.reduce((acc, [x, y]) => {
          const sequence = Array.from({ length: 4 }, (_, index) => {
            return words[row + index * x]?.[column + index * y] || null;
          }).join("");
          const isXmas = sequence === xmas;
          return isXmas ? acc + 1 : acc;
        }, 0);

        count += calculateXmasSum;
      }
    }
  }

  appendAnswerToDay(4, count);
}

async function findMasInX() {
  const words = await getWords();
  let count = 0;
  for (let row = 0; row < words.length; row++) {
    const lettersRow = words[row];
    for (let column = 0; column < lettersRow.length; column++) {
      const letter = lettersRow[column];
      if (letter === "A") {
        const diagonalDownRight =
          (words[row - 1]?.[column - 1] === "S" && words[row + 1]?.[column + 1] === "M") ||
          (words[row - 1]?.[column - 1] === "M" && words[row + 1]?.[column + 1] === "S");
        const diagonalUpRight =
          (words[row - 1]?.[column + 1] === "S" && words[row + 1]?.[column - 1] === "M") ||
          (words[row - 1]?.[column + 1] === "M" && words[row + 1]?.[column - 1] === "S");

        if (diagonalDownRight && diagonalUpRight) {
          count += 1;
        }
      }
    }
  }

  appendAnswerToDay(4, count);
}

findXmas();
findMasInX();
