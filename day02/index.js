async function getReports() {
  const text = await fetchTextFile("./inputs/day2.txt");
  if (text) {
    return text.split("\n").map((row) => row.split(" ").map(Number));
  }
}

const MIN_DISTANCE = 3;

function isReportValid(report) {
  const levelDifference = report.reduce((acc, level, index, arr) => {
    const nextLevel = arr[index + 1];
    if (nextLevel) acc.push(level - nextLevel);
    return acc;
  }, []);

  const isDecreasing = levelDifference.every((level) => level >= 1 && level <= 3);
  const isIncreasing = levelDifference.every((level) => level >= -3 && level <= -1);

  return isDecreasing || isIncreasing;
}

async function calculateValidReport() {
  const reports = await getReports();

  const calculateReportNum = reports.reduce(
    (acc, array) => {
      const isValid = isReportValid(array);

      if (isValid) {
        acc.safe += 1;
      } else {
        let isPassable = false;
        for (let i = 0; i < array.length; i++) {
          const newArray = [...array.slice(0, i), ...array.slice(i + 1)];
          if (isReportValid(newArray)) {
            isPassable = true;
            break;
          }
        }
        acc.safeWithDampener += isPassable ? 1 : 0;
      }

      return acc;
    },
    { safe: 0, safeWithDampener: 0 }
  );
  appendAnswerToDay(2, calculateReportNum.safe);
  appendAnswerToDay(2, calculateReportNum.safe + calculateReportNum.safeWithDampener);
}

calculateValidReport();
