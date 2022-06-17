const regions = [
  ["00", "01", "02", "10", "11", "12", "20", "21", "22"],
  ["03", "04", "05", "13", "14", "15", "23", "24", "25"],
  ["06", "07", "08", "16", "17", "18", "26", "27", "28"],
  ["30", "31", "32", "40", "41", "42", "50", "51", "52"],
  ["33", "34", "35", "43", "44", "45", "53", "54", "55"],
  ["36", "37", "38", "46", "47", "48", "56", "57", "58"],
  ["60", "61", "62", "70", "71", "72", "80", "81", "82"],
  ["63", "64", "65", "73", "74", "75", "83", "84", "85"],
  ["66", "67", "68", "76", "77", "78", "86", "87", "88"],
];

const findRegion = (row, col) => {
  const cel = String(row) + String(col);
  let foundReg = [];
  regions.forEach((r) => {
    if (r.filter((c) => c === cel).length > 0) foundReg = r;
  });
  return foundReg;
};

class SudokuSolver {
  validate(puzzleString) {
    const sudokuRegex = /[1-9]|(\.)/g;

    if (puzzleString.length !== 81) {
      return "length error";
    }
    if (puzzleString.match(sudokuRegex).length !== 81) {
      return "characters error";
    }

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    for (let j = 0; j < 9; j++) {
      if (j === column) continue;
      if (value === puzzleString[row * 9 + j]) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (i === row) continue;
      if (value === puzzleString[i * 9 + column]) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionArr = findRegion(row, column);
    const arrLen = regionArr.length;
    for (let k = 0; k < arrLen; k++) {
      const i = Number(regionArr[k][0]);
      const j = Number(regionArr[k][1]);
      if (i == row && j == column) {
        /* row and column already tested */
        continue;
      }
      if (puzzleString[i * 9 + j] === value) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) return "no solution";

    let valid = true;
    puzzleString.split("").forEach((c, index) => {
      const i = Math.floor(index / 9);
      const j = index % 9;
      if (c !== ".") {
        if (
          !this.checkRowPlacement(puzzleString, i, j, c) ||
          !this.checkColPlacement(puzzleString, i, j, c) ||
          !this.checkRegionPlacement(puzzleString, i, j, c)
        ) {
          valid = false;
        }
      }
    });
    if (!valid) return "no solution";

    const findSolution = (puzzle) => {
      let solution = puzzle;

      regions.forEach((r) => {
        let regionVal = [];
        r.map((e, index) => {
          const i = Number(e[0]);
          const j = Number(e[1]);
          regionVal[index] = { val: solution[i * 9 + j], r: i, c: j };
        });

        for (let val = 1; val < 10; val++) {
          if (regionVal.map((i) => i.val).includes(String(val))) {
            continue;
          } else {
            const test = regionVal.filter(
              (v) =>
                v.val === "." &&
                this.checkRowPlacement(
                  solution.join(""),
                  v.r,
                  v.c,
                  String(val)
                ) &&
                this.checkColPlacement(solution.join(""), v.r, v.c, String(val))
            );

            if (test.length === 1) {
              const pos = Number(test[0].r) * 9 + Number(test[0].c);
              solution[pos] = String(val);
              regionVal = regionVal.map((rv) => {
                if (rv.r == test[0].r && rv.c == test[0].c) {
                  return { ...rv, val: String(val) };
                } else {
                  return rv;
                }
              });
            }
          }
        }
      });

      return solution;
    };
    let solution = puzzleString.split("");
    let stop = solution.filter((i) => i === ".").length;
    let stop0 = stop;
    let num = 0;
    while (stop > 0) {
      solution = findSolution(solution);
      stop = solution.filter((i) => i === ".").length;
      if (stop === stop0) {
        return "no solution";
      }
      stop0 = stop;
      num++;
    }

    //console.log(solution, "iterations:", num);
    return solution.join("");
  }
}

module.exports = SudokuSolver;
