async function calculateSimilarityScore() {
  const { leftColumn, rightColumn } = await getLocationIDLists();

  const calculateRepeatingNumbers = rightColumn.reduce((acc, rightItem) => {
    if (leftColumn.includes(rightItem)) {
      return {
        ...acc,
        [rightItem]: (acc[rightItem] ?? 0) + 1,
      };
    }
    return acc;
  }, {});

  const sumOfRepeating = Object.entries(calculateRepeatingNumbers).reduce((acc, item) => {
    return acc + Number(item[0]) * item[1];
  }, 0);

  appendAnswerToDay(1, sumOfRepeating);
}

calculateSimilarityScore();
