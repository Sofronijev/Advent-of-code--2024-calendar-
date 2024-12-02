async function calculateDifference() {
  const { leftColumn, rightColumn } = await getLocationIDLists();

  const sortedLeft = leftColumn.sort((a, b) => a - b);
  const sortedRight = rightColumn.sort((a, b) => a - b);

  const itemsDifference = sortedLeft.map((leftItem, index) => {
    const rightItem = sortedRight[index];
    return Math.abs(leftItem - rightItem);
  });

  const totalDistance = itemsDifference.reduce((acc, item) => acc + item, 0);

  appendAnswerToDay(1, totalDistance);
}

async function calculateSimilarityScore() {
  const { leftColumn, rightColumn } = await getLocationIDLists();

  const calculateRepeatingNumbers = rightColumn.reduce((acc, rightItem) => {
    if (leftColumn.includes(rightItem)) {
      acc[rightItem] = (acc[rightItem] ?? 0) + 1;
    }
    return acc;
  }, {});

  const sumOfRepeating = Object.entries(calculateRepeatingNumbers).reduce((acc, item) => {
    return acc + Number(item[0]) * item[1];
  }, 0);

  appendAnswerToDay(1, sumOfRepeating);
}

calculateDifference();
calculateSimilarityScore();
