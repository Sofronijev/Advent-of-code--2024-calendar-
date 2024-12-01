async function calculateDifference() {
  const { leftColumn, rightColumn } = await getLocationIDLists();

  const sortedLeft = leftColumn.sort((a, b) => a - b);
  const sortedRight = rightColumn.sort((a, b) => a - b);

  const itemsDifference = sortedLeft.map((leftItem, index) => {
    const rightItem = sortedRight[index];
    return leftItem > rightItem ? leftItem - rightItem : rightItem - leftItem;
  });

  const totalDistance = itemsDifference.reduce((acc, item) => {
    return acc + item;
  }, 0);

  appendAnswerToDay(1, totalDistance)
}

calculateDifference();
