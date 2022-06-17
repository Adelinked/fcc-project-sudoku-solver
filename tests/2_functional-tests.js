const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("POST requests to /api/solve", () => {
    //#13
    test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzlesAndSolutions[2][0] })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, puzzlesAndSolutions[2][1]);
          done();
        });
    });
    //#14
    test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    //#15
    test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
      const puzzle = puzzlesAndSolutions[2][0]
        .split("")
        .map((c, index) => (index % 3 == 0 ? "x" : c))
        .join("");
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    //#16
    test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
      const puzzle = puzzlesAndSolutions[0][0].slice(0, 80);
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    //#17
    test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
      const puzzle = puzzlesAndSolutions[1][0];
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST requests to /api/check", () => {
    //#18
    test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "b7",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });
    //#19
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "a2",
          value: "9",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict, false);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });
    //#20
    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "a2",
          value: "6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict, false);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });
    //#21
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "h5",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isArray(res.body.conflict, false);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });
    //#22
    test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "h5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    //#23
    test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
      const puzzle = puzzlesAndSolutions[2][0]
        .split("")
        .map((c, index) => (index % 5 == 0 ? "%" : c))
        .join("");
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzle,
          coordinate: "h5",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    //#24
    test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0] + "24551..545",
          coordinate: "h5",
          value: "4",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    //#25
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "z1",
          value: "4",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    //#26
    test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: puzzlesAndSolutions[0][0],
          coordinate: "b1",
          value: "0",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
