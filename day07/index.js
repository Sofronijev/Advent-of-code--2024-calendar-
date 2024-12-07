async function getOperations() {
  const text = await fetchTextFile("./inputs/day7.txt");

  const { keys, values } = text.split("\n").reduce(
    (acc, line) => {
      const [key, valString] = line.split(": ");
      acc.keys.push(key);
      acc.values.push(valString.split(" ").map(Number));
      return acc;
    },
    { keys: [], values: [] }
  );
  return { keys, values };
}

function getResult(arr, expectedResult, concat) {
  function recursion(currentResult, index) {
    if (arr.length === index) {
      return currentResult === +expectedResult;
    }

    return (
      (concat && recursion(Number(`${currentResult}` + `${arr[index]}`), index + 1)) ||
      recursion(currentResult + arr[index], index + 1) ||
      recursion(currentResult * arr[index], index + 1)
    );
  }

  return recursion(arr[0], 1);
}

async function calculateOperations() {
  const { keys, values } = await getOperations();

  const calculate = keys.reduce(
    (acc, result, index) => {
      const numbers = values[index];
      const isValid = getResult(numbers, result);
      const isValidConcat = getResult(numbers, result, true);

      if (isValid) {
        acc.result += +result;
      }

      if (isValidConcat) {
        acc.resultConcat += +result;
      }

      return acc;
    },
    { result: 0, resultConcat: 0 }
  );

  appendAnswerToDay(7, calculate.result);
  appendAnswerToDay(7, calculate.resultConcat);
}

calculateOperations();
