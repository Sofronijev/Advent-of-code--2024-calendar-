async function getData() {
  return await fetchTextFile("./inputs/day3.txt");
}

function sumData(data) {
  return data.match(/mul\(\d+,\d+\)/g).reduce((acc, item) => {
    const numbers = item.replace(/mul\(|\)/g, "").split(",");
    const multiply = +numbers[0] * +numbers[1];
    return acc + multiply;
  }, 0);
}

async function getMulInstructions() {
  const text = await getData();
  const sum = sumData(text);
  appendAnswerToDay(3, sum);
}

async function getMulInstructionsWithCondition() {
  const text = await getData();

  const filteredInput = text
    .split("do()")
    .map((elem) => elem.split("don't()")[0])
    .join();

  const sum = sumData(filteredInput);
  appendAnswerToDay(3, sum);
}

getMulInstructions();
getMulInstructionsWithCondition();
