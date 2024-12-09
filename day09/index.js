const DAY = 9;
async function getDisk() {
  const text = await fetchTextFile("./inputs/day9.txt");

  return text;
}

function defragment(map) {
  const EMPTY = ".";
  const fileSystem = [...map];

  for (let i = 0; i < fileSystem.length; i++) {
    if (fileSystem[i] === EMPTY) {
      for (let j = fileSystem.length - 1; j > i; j--) {
        if (fileSystem[j] !== EMPTY) {
          fileSystem[i] = fileSystem[j];
          fileSystem.splice(j);
          break;
        }
      }
    }
  }

  return fileSystem;
}

async function fragmentDisk() {
  const disk = await getDisk();
  const files = [];

  for (let i = 0; i < disk.length; i++) {
    const index = Math.floor(i / 2);
    for (let y = 0; y < disk[i]; y++) {
      i % 2 === 0 ? files.push(index) : files.push(".");
    }
  }

  const sortedFile = defragment(files);

  const sum = sortedFile.reduce((acc, value, index) => {
    if (value !== EMPTY || !index) {
      return acc + value * index;
    }
    return acc;
  }, 0);

  appendAnswerToDay(DAY, sum);
}

fragmentDisk();
