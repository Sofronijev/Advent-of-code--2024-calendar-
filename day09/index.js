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

function defragmentWhole(map) {
  const fileSystem = [...map];
  for (let i = fileSystem.length - 1; i > 0; i--) {
    if (fileSystem[i].length && !fileSystem[i].includes(EMPTY)) {
      for (let j = 0; j < i; j++) {
        if (fileSystem[j].length && fileSystem[j].includes(EMPTY)) {
          const firstEmptyIndex = fileSystem[j].indexOf(EMPTY);
          let numberPart = fileSystem[j].slice(0, firstEmptyIndex);
          let emptyPart = fileSystem[j].slice(firstEmptyIndex);

          if (emptyPart.length >= fileSystem[i].length) {
            emptyPart = [...fileSystem[i], ...emptyPart.slice(fileSystem[i].length)];
            fileSystem[i] = Array(fileSystem[i].length).fill(EMPTY);
            fileSystem[j] = [...numberPart, ...emptyPart];
            break;
          }
        }
      }
    }
  }

  return fileSystem.flat();
}

async function fragmentDisk() {
  const disk = await getDisk();
  const diskMap = [];
  const diskMapWhole = [];

  for (let i = 0; i < disk.length; i++) {
    const index = Math.floor(i / 2);
    for (let y = 0; y < disk[i]; y++) {
      i % 2 === 0 ? diskMap.push(index) : diskMap.push(".");
    }
  }

  for (let i = 0; i < disk.length; i++) {
    const index = Math.floor(i / 2);
    i % 2 === 0
      ? diskMapWhole.push(Array.from({ length: disk[i] }, () => Number(index)))
      : diskMapWhole.push([...".".repeat(disk[i])].map((a) => a));
  }

  const sortedFile = defragment(diskMap);
  const sortedWhole = defragmentWhole(diskMapWhole);

  const sum = (disk) =>
    disk.reduce((acc, value, index) => {
      if (value !== "." || !index) {
        return acc + +value * index;
      }
      return acc;
    }, 0);

  appendAnswerToDay(DAY, sum(sortedFile));
  appendAnswerToDay(DAY, sum(sortedWhole));
}

fragmentDisk();
