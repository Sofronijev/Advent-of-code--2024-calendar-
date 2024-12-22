async function getData() {
  const text = await fetchTextFile("./inputs/day14.txt");

  if (text) {
    return text
      .trim()
      .split("\n")
      .map((line) => {
        const [pPart, vPart] = line.split(" ");
        const [px, py] = pPart.slice(2).split(",").map(Number);
        const [vx, vy] = vPart.slice(2).split(",").map(Number);
        return { p: { x: px, y: py }, v: { x: vx, y: vy } };
      });
  }
}

function getQuadrantsSum(input, seconds) {
  const spaceWidth = 101;
  const spaceHeight = 103;

  const horizontalMiddle = Math.floor(spaceHeight / 2);
  const verticalMiddle = Math.floor(spaceWidth / 2);
  const data = input.reduce(
    (acc, robot) => {
      // calculate final position
      const { p, v } = robot;
      const robotX = (p.x + v.x * seconds) % spaceWidth;
      const robotY = (p.y + v.y * seconds) % spaceHeight;

      const absX = robotX < 0 ? robotX + spaceWidth : robotX;
      const absY = robotY < 0 ? robotY + spaceHeight : robotY;

      if (absX === verticalMiddle || absY === horizontalMiddle) {
        return acc;
      }

      if (absX < verticalMiddle && absY < horizontalMiddle) {
        acc.q1 += 1;
      }

      if (absX > verticalMiddle && absY < horizontalMiddle) {
        acc.q2 += 1;
      }

      if (absX < verticalMiddle && absY > horizontalMiddle) {
        acc.q3 += 1;
      }

      if (absX > verticalMiddle && absY > horizontalMiddle) {
        acc.q4 += 1;
      }

      return acc;
    },
    { q1: 0, q2: 0, q3: 0, q4: 0 }
  );
  return data.q1 * data.q2 * data.q3 * data.q4;
}

async function predictRobots() {
  const input = await getData();

  const spaceWidth = 101;
  const spaceHeight = 103;

  const SECONDS = 100;

  const result = getQuadrantsSum(input, SECONDS);

  // https://youtu.be/ySUUTxVv31U?si=I-dKC_vlLfKljfdK
  let safetyFactor = Infinity;
  let secondsToChristmasTree = 0;

  for (let i = 1; i < spaceHeight * spaceWidth; i++) {
    const quadrants = getQuadrantsSum(input, i);
    if (quadrants < safetyFactor) {
      safetyFactor = quadrants;
      secondsToChristmasTree = i;
    }
  }

  appendAnswerToDay(14, result);
  appendAnswerToDay(14, secondsToChristmasTree);
}

predictRobots();
