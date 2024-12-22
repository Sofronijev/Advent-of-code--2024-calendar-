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

async function predictRobots() {
  const input = await getData();

  const spaceWidth = 101;
  const spaceHeight = 103;

  const horizontalMiddle = Math.floor(spaceHeight / 2);
  const verticalMiddle = Math.floor(spaceWidth / 2);

  const SECONDS = 100;

  const data = input.reduce(
    (acc, robot) => {
      // calculate final position
      const { p, v } = robot;
      const robotX = (p.x + v.x * SECONDS) % spaceWidth;
      const robotY = (p.y + v.y * SECONDS) % spaceHeight;

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

      console.log(absX, absY);
      return acc;
    },
    { q1: 0, q2: 0, q3: 0, q4: 0 }
  );
  const result = data.q1 * data.q2 * data.q3 * data.q4;
  console.log(input);
  console.log(data);
  appendAnswerToDay(14, result);
}

predictRobots();
