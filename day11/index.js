async function getData() {
  const text = await fetchTextFile("./inputs/day11.txt");

  if (text) {
    return text.split(" ").map((item) => Number(item));
  }
}

function transformStones(stones, default_blinks) {
  const cachedStones = new Map();
  function count(stone, steps) {
    const cacheKey = `${stone}-${steps}`;

    if (cachedStones.has(cacheKey)) return cachedStones.get(cacheKey);

    if (steps === 0) return 1;

    if (stone === 0) {
      const result = count(1, steps - 1);
      cachedStones.set(cacheKey, result);
      return result;
    }
    const numToString = `${stone}`;

    if (numToString.length % 2 === 0) {
      const middle = numToString.length / 2;
      const part1 = parseInt(numToString.slice(0, middle));
      const part2 = parseInt(numToString.slice(middle));
      const result = count(part1, steps - 1) + count(part2, steps - 1);
      cachedStones.set(cacheKey, result);
      return result;
    }
    result = count(stone * 2024, steps - 1);
    cachedStones.set(cacheKey, result);
    return result;
  }

  return stones.map((stone) => count(stone, default_blinks)).reduce((acc, item) => acc + item, 0);
}

async function calculateStones() {
  const data = await getData();

  const stones = transformStones(data, 25);
  appendAnswerToDay(11, stones);
  const stones2 = transformStones(data, 75);
  appendAnswerToDay(11, stones2);
}

calculateStones();
