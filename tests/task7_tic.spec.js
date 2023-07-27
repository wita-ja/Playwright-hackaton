import { expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";

// var game;
// var bigBoardDisplay = new BigBoardDisplay();
// var socket;
// var online = location.pathname.split("/")[1] === "online-game";
// var players = [];

// var gameCaption = $("#game-caption");
// var opponent = $("#opponent");
// var first = $("#first");
// var difficulty = $("#difficulty");
// var newGame = $("#new-game");
// var playerDisplay = $("#player-display");
// var connectionStatus = $("#connection-status");
// var url = $("#url");
// var historyTableBody = $("#history-table>tbody");
test("has title", async ({ page }) => {
  function Game(aiPlayer, difficulty) {
    this.playerWhoseTurnItIs = "X";
    this.history = [];
    this.bigBoard = new BigBoard();
    this.aiPlayer = aiPlayer;
    this.difficulty = difficulty;
  }

  Game.prototype.getPossibleMoves = function () {
    var smallBoard = this.getCurrentSmallBoard();
    if (this.history.length === 0 || smallBoard.winner) {
      return this.bigBoard.getPossibleMoves();
    }
    if (this.bigBoard.winner === null) {
      return smallBoard.getPossibleMoves();
    }
    return [];
  };

  Game.prototype.getCurrentSmallBoard = function () {
    var smallBoard;
    if (this.history.length > 0) {
      var previousCellLocation =
        this.history[this.history.length - 1].cellLocation;
      smallBoard =
        this.bigBoard.children[previousCellLocation.row][
          previousCellLocation.col
        ];
    }
    return smallBoard;
  };

  Game.prototype.getScore = function () {
    var score = this.bigBoard.score;
    if (this.aiPlayer === "O") {
      score *= -1;
    }
    return score;
  };

  Game.prototype.makeMove = function (move) {
    var smallBoard = this.getCurrentSmallBoard();
    if (
      this.history.length === 0 ||
      smallBoard.winner ||
      (move.smallBoardLocation.row === smallBoard.location.row &&
        move.smallBoardLocation.col === smallBoard.location.col)
    ) {
      var success = this.bigBoard.makeMove(move, this.playerWhoseTurnItIs);
      if (success) {
        if (this.playerWhoseTurnItIs === "X") {
          this.playerWhoseTurnItIs = "O";
        } else {
          this.playerWhoseTurnItIs = "X";
        }
        this.history.push(move);
        return true;
      }
    }
    return false;
  };

  Game.prototype.minimax = function (depth, player, alpha, beta) {
    var moves = this.getPossibleMoves();

    var score, bestMove;

    if (moves.length === 0 || depth === this.difficulty) {
      score = this.getScore();
      return {
        score: score,
        move: null,
      };
    }

    for (var i = 0; i < moves.length; i++) {
      var move = moves[i];
      this.makeMove(move);
      score = this.minimax(
        depth + 1,
        player === "X" ? "O" : "X",
        alpha,
        beta
      ).score;
      if (player === this.aiPlayer) {
        if (score > alpha) {
          alpha = score;
          bestMove = move;
        }
      } else {
        if (score < beta) {
          beta = score;
          bestMove = move;
        }
      }
      this.undoMove();
      if (alpha >= beta) {
        break;
      }
    }

    return {
      score: player === this.aiPlayer ? alpha : beta,
      move: bestMove,
    };
  };

  Game.prototype.undoMove = function () {
    if (this.history.length > 0) {
      if (this.playerWhoseTurnItIs === "X") {
        this.playerWhoseTurnItIs = "O";
      } else {
        this.playerWhoseTurnItIs = "X";
      }
      var move = this.history.pop();
      this.bigBoard.undoMove(move);
    }
  };

  function BigBoard() {
    this.children = [];
    for (var i = 0; i < 3; i++) {
      this.children.push([]);
      for (var j = 0; j < 3; j++) {
        this.children[i].push(new SmallBoard(new Location(i, j)));
      }
    }

    var diag1 = [];
    var diag2 = [];
    for (var i = 0; i < 3; i++) {
      diag1.push(this.children[i][i]);
      diag2.push(this.children[i][2 - i]);
      var row = [];
      var col = [];
      for (var j = 0; j < 3; j++) {
        row.push(this.children[i][j]);
        col.push(this.children[j][i]);
      }
      new Line(row);
      new Line(col);
    }
    new Line(diag1);
    new Line(diag2);

    this.score = 0;

    this.winner = null;
    this.numChildrenCompleted = 0;
  }

  BigBoard.prototype.undoMove = function (move) {
    var smallBoard =
      this.children[move.smallBoardLocation.row][move.smallBoardLocation.col];
    if (smallBoard.winner) {
      this.numChildrenCompleted--;
    }
    this.score -= smallBoard.score;
    smallBoard.undoMove(move);
    this.score += smallBoard.score;
    this.winner = null;
  };

  BigBoard.prototype.getPossibleMoves = function () {
    var moves = [];
    if (this.winner === null) {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          moves = moves.concat(this.children[i][j].getPossibleMoves());
        }
      }
    }
    return moves;
  };

  BigBoard.prototype.makeMove = function (move, player) {
    if (this.winner === null) {
      var smallBoard =
        this.children[move.smallBoardLocation.row][move.smallBoardLocation.col];
      this.score -= smallBoard.score;
      var success = smallBoard.makeMove(move, player);
      this.score += smallBoard.score;
      if (success) {
        if (smallBoard.winner) {
          this.numChildrenCompleted++;
          if (this.numChildrenCompleted === 9) {
            this.winner = "tie";
          }
          for (var i = 0; i < smallBoard.lines.length; i++) {
            if (smallBoard.lines[i].numInARow === 3) {
              this.winner = smallBoard.lines[i].player;
              break;
            }
          }
        }
        return true;
      }
    }
    return false;
  };

  function SmallBoard(location) {
    this.location = location;
    this.children = [];
    for (var i = 0; i < 3; i++) {
      this.children.push([]);
      for (var j = 0; j < 3; j++) {
        this.children[i].push(new Cell(new Location(i, j)));
      }
    }

    var diag1 = [];
    var diag2 = [];
    for (var i = 0; i < 3; i++) {
      diag1.push(this.children[i][i]);
      diag2.push(this.children[i][2 - i]);
      var row = [];
      var col = [];
      for (var j = 0; j < 3; j++) {
        row.push(this.children[i][j]);
        col.push(this.children[j][i]);
      }
      new Line(row);
      new Line(col);
    }
    new Line(diag1);
    new Line(diag2);

    this.score = 0;

    this.lines = [];
    this.winner = null;
    this.numChildrenCompleted = 0;
  }

  SmallBoard.prototype.makeMove = function (move, player) {
    if (this.winner === null) {
      var cell = this.children[move.cellLocation.row][move.cellLocation.col];
      this.score -= cell.score;
      var success = cell.makeMove(player);
      this.score += cell.score;
      if (success) {
        this.numChildrenCompleted++;
        if (this.numChildrenCompleted === 9) {
          this.winner = "tie";
        }
        for (var i = 0; i < cell.lines.length; i++) {
          if (cell.lines[i].numInARow === 3) {
            this.winner = cell.lines[i].player;
            break;
          }
        }
        if (this.winner) {
          for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].evaluate();
          }
        }
        return true;
      }
    }
    return false;
  };

  SmallBoard.prototype.undoMove = function (move) {
    var cell = this.children[move.cellLocation.row][move.cellLocation.col];
    this.score -= cell.score;
    cell.undoMove();
    this.score += cell.score;
    this.numChildrenCompleted--;
    if (this.winner) {
      this.winner = null;
      for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].evaluate();
      }
    }
  };

  SmallBoard.prototype.getPossibleMoves = function () {
    var moves = [];
    if (this.winner === null) {
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          if (this.children[i][j].winner === null) {
            moves.push(new Move(this.location, this.children[i][j].location));
          }
        }
      }
    }
    return moves;
  };

  function Move(smallBoardLocation, cellLocation) {
    this.smallBoardLocation = smallBoardLocation;
    this.cellLocation = cellLocation;
    this.notation = smallBoardLocation.notation + "/" + cellLocation.notation;
  }

  function Line(children) {
    this.children = children;
    for (var i = 0; i < 3; i++) {
      this.children[i].lines.push(this);
    }
    this.player = null;
    this.numInARow = 0;
    this.score = 0;
  }

  Cell.prototype.undoMove = function () {
    this.winner = null;
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].evaluate();
    }
  };

  Line.prototype.evaluate = function () {
    var counter = {
      X: 0,
      O: 0,
      tie: 0,
    };
    for (var i = 0; i < this.children.length; i++) {
      if (this.children[i].winner) {
        counter[this.children[i].winner]++;
      }
      this.children[i].score -= this.score;
    }
    if (counter.tie > 0 || counter.X > 0 === counter.O > 0) {
      this.player = null;
      this.numInARow = 0;
      this.score = 0;
    } else if (counter.X > 0) {
      this.player = "X";
      this.numInARow = counter.X;
      if (this.children[0] instanceof Cell) {
        this.score = Math.pow(10, this.numInARow - 1);
      } else {
        this.score = Math.pow(10, this.numInARow + 1);
      }
    } else {
      this.player = "O";
      this.numInARow = counter.O;
      if (this.children[0] instanceof Cell) {
        this.score = -Math.pow(10, this.numInARow - 1);
      } else {
        this.score = -Math.pow(10, this.numInARow + 1);
      }
    }
    for (var i = 0; i < this.children.length; i++) {
      this.children[i].score += this.score;
    }
  };

  function Cell(location) {
    this.location = location;
    this.lines = [];
    this.winner = null;
    this.score = 0;
  }

  Cell.prototype.makeMove = function (player) {
    if (this.winner === null) {
      this.winner = player;
      for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].evaluate();
      }
      return true;
    }
    return false;
  };

  function Location() {
    if (typeof arguments[0] === "string") {
      this.notation = arguments[0];

      var firstChar = this.notation.charAt(0);
      var lastChar = this.notation.charAt(this.notation.length - 1);

      if (firstChar === "N") {
        this.row = 0;
      } else if (firstChar === "S") {
        this.row = 2;
      } else {
        this.row = 1;
      }
      if (lastChar === "W") {
        this.col = 0;
      } else if (lastChar === "E") {
        this.col = 2;
      } else {
        this.col = 1;
      }
    } else {
      this.row = arguments[0];
      this.col = arguments[1];

      this.notation = "";

      if (this.row === 0) {
        this.notation += "N";
      } else if (this.row === 2) {
        this.notation += "S";
      }
      if (this.col === 0) {
        this.notation += "W";
      } else if (this.col === 2) {
        this.notation += "E";
      }
      if (this.notation.length === 0) {
        this.notation = "C";
      }
    }
  }

  const newGame = new Game("X", 6);

  await page.goto("https://ttt-gediminas.onrender.com/local-game");
  await page.locator("#new-game").click();

  const smallBoardN = page.locator(".smallBoard.N");
  const smallBoardNE = page.locator(".smallBoard.NE");
  const smallBoardE = page.locator(".smallBoard.E");
  const smallBoardSE = page.locator(".smallBoard.SE");
  const smallBoardS = page.locator(".smallBoard.S");
  const smallBoardW = page.locator(".smallBoard.W");
  const smallBoardSW = page.locator(".smallBoard.SW");
  const smallBoardNW = page.locator(".smallBoard.NW");
  const smallBoardC = page.locator(".smallBoard.C");

  function getCell(smallboardLocation, cellLocation) {
    return page.locator(
      `.smallBoard.${smallboardLocation} .cell.${cellLocation}`
    );
  }
  // const cellN = page.locator(".cell.N");
  // const cellNE = page.locator(".cell.NE");
  // const cellE = page.locator(".cell.E");
  // const cellSE = page.locator(".cell.SE");
  // const cellS = page.locator(".cell.S");
  // const cellW = page.locator(".cell.W");
  // const cellSW = page.locator(".cell.SW");
  // const cellNW = page.locator(".cell.NW");
  // const cellC = page.locator(".cell.C");

  let historySize = 0;
  while (!(await page.getByText(/wins!/).isVisible())) {
    function aiMove(game) {
      let resut;
      resut = game.minimax(0, game.aiPlayer, -Infinity, Infinity).move;

      return resut;
    }
    const nextMove = aiMove(newGame);
    // await page.waitForTimeout(3000);
    // console.log(nextMove);
    // console.log(newGame.history);
    await getCell(
      nextMove.smallBoardLocation.notation,
      nextMove.cellLocation.notation
    ).click();
    newGame.makeMove(
      new Move(
        new Location(nextMove.smallBoardLocation.notation),
        new Location(nextMove.cellLocation.notation)
      )
    );
    while (!(await page.getByText(/X's turn/).isVisible())) {
      if (await page.getByText(/wins!/).isVisible()) {
        break;
      }
    }
    if (await page.getByText(/wins!/).isVisible()) {
      break;
    }
    const history = page.locator("#history-table");
    const trs = await history.locator("tbody tr").all();
    move++;

    console.log(trs);
    console.log(move);
    console.log(trs[move]);
    const aiMoved = trs[trs.length - 1].locator("td").last();
    const aiMoveData = await aiMoved.textContent();
    const [smallBoardMove, cellMove] = aiMoveData.split("/");
    newGame.makeMove(
      new Move(new Location(smallBoardMove), new Location(cellMove))
    );

    // console.log();
  }
  // console.log(faker.animal.cat());

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});
