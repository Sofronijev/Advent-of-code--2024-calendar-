async function getData() {
  const text = await fetchTextFile("./inputs/day11.txt");

  if (text) {
    return text.split(" ").map((item) => Number(item));
  }
}

function transformStones(stones) {
  const default_blinks = 75;
  let stoneData = [];

  function recursion(data, blinks) {
    if (blinks > default_blinks) {
      stoneData = data;
      return;
    }

    let newStones = [];

    data.forEach((stone) => {
      const numToString = `${stone}`;
      if (stone === 0) {
        newStones.push(1);
      } else if (numToString.length % 2 === 0) {
        const middle = numToString.length / 2;
        const part1 = numToString.slice(0, middle);
        const part2 = numToString.slice(middle);
        newStones.push(parseInt(part1), parseInt(part2));
      } else {
        newStones.push(stone * 2024);
      }
    });

    recursion(newStones, blinks + 1);
  }

  recursion(stones, 1);

  return stoneData;
}

async function calculateStones(params) {
  const data = await getData();

  const stones = transformStones(data);
  appendAnswerToDay(11, stones.length);
}

calculateStones();
