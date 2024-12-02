async function getReports() {
  const text = await fetchTextFile("./day02/input.txt");
  if (text) {
    return text.split("\n").map((row) => row.split(" ").map(Number));
  }
}

const MIN_DISTANCE = 3;

function expectAsc(array) {
  const [firstNum, secondNum] = array;
  return firstNum < secondNum && secondNum - firstNum <= MIN_DISTANCE;
}

function isReportValid(arr) {
  return arr.every((currentNumber, i) => {
    const nextNumber = arr[i + 1];
    return (
      nextNumber == null ||
      (nextNumber > currentNumber && Math.abs(currentNumber - nextNumber) <= MIN_DISTANCE)
    );
  });
}

async function calculateValidReport() {
  const reports = await getReports();

  const calculateReportNum = reports.reduce((acc, array) => {
    const reportArray = expectAsc(array) ? array : array.reverse();
    return isReportValid(reportArray) ? acc + 1 : acc;
  }, 0);

  appendAnswerToDay(2, calculateReportNum);
}

calculateValidReport();
