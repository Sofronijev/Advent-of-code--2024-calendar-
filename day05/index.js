async function getProtocols() {
  const text = await fetchTextFile("./inputs/day5.txt");

  if (text) {
    return text.split(/\n\s*\n/).map((part) => part.split("\n").map((line) => line.trim()));
  }
}

function calculateMiddleSum(data) {
  return data.reduce((acc, item) => {
    return acc + +item[(item.length - 1) / 2];
  }, 0);
}

async function checkProtocols() {
  const [rules, update] = await getProtocols();
  const { rulesAfter, rulesBefore } = rules.reduce(
    (acc, rule) => {
      const [first, second] = rule.split("|");
      acc.rulesAfter[first] = [...(acc.rulesAfter[first] ?? []), second];
      acc.rulesBefore[second] = [...(acc.rulesBefore[second] ?? []), first];

      return acc;
    },
    { rulesAfter: {}, rulesBefore: {} }
  );

  const updatesArr = update.map((item) => item.split(","));

  const checkUpdates = updatesArr.reduce(
    (acc, update) => {
      const isValid = update.every((updateNum, index, array) => {
        const leftSide = array.slice(0, index);
        const rightSide = array.slice(index + 1);

        return (
          leftSide.every((n) => rulesBefore[updateNum]?.includes(n)) &&
          rightSide.every((n) => rulesAfter[updateNum]?.includes(n))
        );
      });
      if (isValid) {
        acc.valid.push(update);
      } else {
        const sorted = update.toSorted((a, b) => {
          if (rulesAfter[a] && rulesAfter[a].includes(b)) {
            return 1;
          }

          if (rulesBefore[a] && rulesBefore[a].includes(b)) {
            return -1;
          }

          return 0;
        });
        acc.invalid.push(sorted);
      }

      return acc;
    },
    { valid: [], invalid: [] }
  );

  appendAnswerToDay(5, calculateMiddleSum(checkUpdates.valid));
  appendAnswerToDay(5, calculateMiddleSum(checkUpdates.invalid));
}

checkProtocols();
