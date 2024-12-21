async function getData() {
  const text = await fetchTextFile("./inputs/day13.txt");

  if (text) {
    const normalizedInput = text.replace(/\r/g, "").trim();
    const splitByPrize = normalizedInput.split("\n\n");

    return splitByPrize.map((chunk) => {
      const lines = chunk.split("\n");

      const parseLine = (line) => {
        const [, x, y] = line.match(/X[+=](\d+), Y[+=](\d+)/);
        return { x: parseInt(x, 10), y: parseInt(y, 10) };
      };

      const prizeLine = lines[2];
      const [, prizeX, prizeY] = prizeLine.match(/X=(\d+), Y=(\d+)/);

      return {
        A: parseLine(lines[0]),
        B: parseLine(lines[1]),
        price: { x: parseInt(prizeX, 10), y: parseInt(prizeY, 10) },
      };
    });
  }
}

function findPrizes(data) {
  const { x, y } = data.price;
  const { x: xA, y: yA } = data.A;
  const { x: xB, y: yB } = data.B;
  const priceX = x;
  const priceY = y;
  let tokens = 0;

  for (let i = 0; i < 100; i++) {
    if (tokens) break;
    for (let j = 0; j < 100; j++) {
      if (xA * i + xB * j === priceX && yA * i + yB * j === priceY) {
        tokens = i * 3 + j;
        break;
      }
    }
  }

  return tokens;
}

async function calculateTokens() {
  const data = await getData();
  const result = data.reduce((acc, item) => {
    const price = findPrizes(item);
    return acc + +price;
  }, 0);
  appendAnswerToDay(13, result);
}

calculateTokens();
