async function fetchTextFile(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error:", error);
  }
}

const processList = (text) => {
  const leftColumn = [];
  const rightColumn = [];
  const formattedLines = text.trim().split("\n");

  formattedLines.forEach((line) => {
    const [left, right] = line.split(/\s+/);
    leftColumn.push(parseInt(left, 10));
    rightColumn.push(parseInt(right, 10));
  });

  return { leftColumn, rightColumn };
};

async function getLocationIDLists() {
  const text = await fetchTextFile("./day01/input.txt");
  if (text) {
    return processList(text);
  }
}

function appendAnswerToDay(day, answer) {
  const dayContainer = document.querySelector(`.day-container.day${day} .answers`);
  console.log(dayContainer);
  if (dayContainer) {
    const numberOfChildren = dayContainer.children.length;

    const answerText = document.createElement("p");
    answerText.classList.add("answer-text");
    answerText.innerHTML = `Part ${numberOfChildren + 1}: <span class="answer">${answer}</span>`;
    dayContainer.appendChild(answerText);
  }
}
