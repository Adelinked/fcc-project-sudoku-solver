"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const rowCol = (coord) => {
  if (typeof coord !== "string" || coord.length !== 2) return [false, false];
  const row = coord[0].charCodeAt(0) - "a".charCodeAt(0);
  const col = Number(coord[1]) - 1;
  return [row, col];
};

module.exports = function (app) {
  let solver = new SudokuSolver();
  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coord = req.body.coordinate;
    const value = req.body.value;
    //console.log(req.body);
    const [row, col] = rowCol(coord);
    if (!value || !coord || !puzzle) {
      res.json({ error: "Required field(s) missing" });
    }
    if (solver.validate(puzzle) === "length error") {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (solver.validate(puzzle) === "characters error") {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    if (
      typeof row !== "number" ||
      typeof col !== "number" ||
      col < 0 ||
      row < 0 ||
      col > 9 ||
      row > 9
    ) {
      res.json({ error: "Invalid coordinate" });
    }
    if (!parseInt(value) || value < 1 || value > 9) {
      res.json({ error: "Invalid value" });
    }

    const rowValid = solver.checkRowPlacement(puzzle, row, col, value);
    const colValid = solver.checkColPlacement(puzzle, row, col, value);
    const regionValid = solver.checkRegionPlacement(puzzle, row, col, value);
    if (rowValid && colValid && regionValid) {
      res.json({ valid: true });
    } else {
      let confArr = [];
      if (!rowValid) confArr.push("row");
      if (!colValid) confArr.push("column");
      if (!regionValid) confArr.push("region");
      res.json({ valid: false, conflict: confArr });
    }

    // res.json({ row: row, col: col });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) {
      res.json({ error: "Required field missing" });
      return;
    }

    if (solver.validate(puzzle) === "length error") {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }

    if (solver.validate(puzzle) === "characters error") {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    const sol = solver.solve(puzzle);
    if (sol === "no solution") {
      res.json({ error: "Puzzle cannot be solved" });
      return;
    } else {
      res.json({ solution: sol });
    }
  });
};
