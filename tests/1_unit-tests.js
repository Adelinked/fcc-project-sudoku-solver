const chai = require("chai");
const assert = chai.assert;
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  suite("Puzzle logic tests", () => {
    //#1
    test("Logic handles a valid puzzle string of 81 characters", () => {
      assert.equal(solver.validate(puzzlesAndSolutions[0][0]), true);
      assert.equal(solver.validate(puzzlesAndSolutions[0][1]), true);
    });

    //#2
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
      assert.equal(
        solver.validate(
          puzzlesAndSolutions[2][0]
            .split("")
            .map((c, index) => (index % 3 == 0 ? "z" : c))
            .join("")
        ),
        "characters error"
      );
    });
    //#3
    test("Logic handles a puzzle string that is not 81 characters in length", () => {
      assert.equal(
        solver.validate(puzzlesAndSolutions[0][0].slice(0, 80)),
        "length error"
      );
      assert.equal(
        solver.validate(puzzlesAndSolutions[1][1] + "123.56."),
        "length error"
      );
    });
  });

  suite("row placement login tests", () => {
    //#4
    test("Logic handles a valid row placement", () => {
      assert.equal(
        solver.checkRowPlacement(puzzlesAndSolutions[3][0], 3, 0, "1"),
        true
      );
    });
    //#5
    test("Logic handles an invalid row placement", () => {
      assert.equal(
        solver.checkRowPlacement(puzzlesAndSolutions[3][0], 3, 0, "7"),
        false
      );
    });
  });
  suite("column placement login tests", () => {
    //#6
    test("Logic handles a valid column placement", () => {
      assert.equal(
        solver.checkColPlacement(puzzlesAndSolutions[3][0], 4, 7, "5"),
        true
      );
    });
    //#7
    test("Logic handles an invalid column placement", () => {
      assert.equal(
        solver.checkColPlacement(puzzlesAndSolutions[3][0], 4, 7, "1"),
        false
      );
    });
  });
  suite("Logic region (3x3 grid) placement", () => {
    //#8
    test("Logic handles a valid region (3x3 grid) placement", () => {
      assert.equal(
        solver.checkRegionPlacement(puzzlesAndSolutions[3][0], 4, 7, "5"),
        true
      );
    });
    //#9
    test("Logic handles an invalid region (3x3 grid) placement", () => {
      assert.equal(
        solver.checkRegionPlacement(puzzlesAndSolutions[3][0], 4, 7, "6"),
        false
      );
    });
  });
  suite("Solver Logic", () => {
    //#10
    test("Valid puzzle strings pass the solver", () => {
      assert.equal(
        solver.solve(puzzlesAndSolutions[0][1]),
        puzzlesAndSolutions[0][1]
      );
    });
    //#11
    test("Invalid puzzle strings fail the solver", () => {
      assert.equal(solver.solve(puzzlesAndSolutions[1][0]), "no solution");
    });
    //#12
    test("Solver returns the expected solution for an incomplete puzzle", () => {
      assert.equal(
        solver.solve(puzzlesAndSolutions[0][0]),
        puzzlesAndSolutions[0][1]
      );
      assert.equal(
        solver.solve(puzzlesAndSolutions[2][0]),
        puzzlesAndSolutions[2][1]
      );
      assert.equal(
        solver.solve(puzzlesAndSolutions[3][0]),
        puzzlesAndSolutions[3][1]
      );
      assert.equal(
        solver.solve(puzzlesAndSolutions[4][0]),
        puzzlesAndSolutions[4][1]
      );
    });
  });
});
