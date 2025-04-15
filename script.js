const BOARD_SIZE = 3;
const NUMBER_OF_PLAYERS = 2;
const PLAYERS_MARKS = ["X", "O"];

const events = (function () {
    const events = {};

    function on(eventName, fn) {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
    }

    function off(eventName, fn) {
        if (!events[eventName]) return;

        for (e in events[eventName]) {
            if (events[eventName][e] == fn) {
                events[eventName].splice(e, 1);
                break;
            }
        }
    }

    function emit(eventName, data) {
        if (!events[eventName]) return;
        events[eventName].forEach(e => e(data));
    }
    
    return { on, off, emit };
})();

const gameDisplay = (function () {
    const displayDiv = document.querySelector(".board-display");
    const player1Div = document.querySelector("#player1");
    const player2Div = document.querySelector("#player2");

    init();

    function init() {
        events.on("boardChanged", createBoard);
        events.on("scoreChanged", updateScore);

        displayDiv.addEventListener("click", (e) => {
            const cell = e.target;
            const row = parseInt(cell.dataset.row);
            const column = parseInt(cell.dataset.column);
            events.emit("turnPlayed", [row, column]);
        });

        displayPlayer(player1Div);
        displayPlayer(player2Div);

        const restartButton = document.querySelector(".restart-button");
        restartButton.addEventListener("click", (e) => { events.emit("restart") });
    }

    function updateScore(scores) {
        player1Div.querySelector(".player-score").innerText = `Score ${scores[0]}`;
        player2Div.querySelector(".player-score").innerText = `Score ${scores[1]}`;
    }

    function displayPlayer(player) {
        const playerButton = player.querySelector(".add-player-button");
        const playerInput = player.querySelector("input");
        const playerInfo = player.querySelector(".player-info")
        playerButton.addEventListener("click", (e) => {
            const playerName = playerInput.value; 
            events.emit("addPlayer", playerName);
            playerInput.value = "";
            player.querySelector(".add-player-input").style.display = "none" ;
            
            playerInfo.style.display = "block";
            playerInfo.querySelector(".player-name").innerText = playerName;
        });
    }

    function createBoard(board) {
        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board-display");
        
        for (row in board) {
            const rowDiv = makeRow(board[row], row);
            boardDiv.appendChild(rowDiv);
        }

        displayDiv.innerHTML = boardDiv.innerHTML;
    }

    function makeRow(row, index) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("board-row");
        
        for (cell in row) {
            rowDiv.appendChild(makeCell(row[cell], index, cell));
        }

        return rowDiv;
    }

    function makeCell(cell, row, column) {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("board-cell");
        cellDiv.innerText = cell.getMark();

        cellDiv.setAttribute("data-row", row);
        cellDiv.setAttribute("data-column", column);

        return cellDiv;
    }
})();

const gameBoard = (function () {
    // Represent the Tic-Tac-Toe board
    const board = [];
    let empty_spaces = BOARD_SIZE * BOARD_SIZE;
    let currentMark = PLAYERS_MARKS[0];
    let active = false;

    init();

    function init() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            const row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push(makeBoardSpace(i, j));
            }
            board.push(row);
        }
        events.emit("boardChanged", board);
        events.on("startGame", activate);
        events.on("won", reset);
        events.on("draw", reset);
        events.on("restart", reset);
        events.on("turnPlayed", markSpace);
        events.on("playerChanged", changeMark)
    }

    function activate() {
        active = true;
    }

    function changeMark(currentPlayer) {
        currentMark = PLAYERS_MARKS[currentPlayer];
    }

    function makeBoardSpace(row, column) {
        let mark = "";

        function getMark() {
            return mark;
        }

        function setMark(newMark) {
            mark = newMark;
        }

        function getRow() {
            return row;
        }

        function getColumn() {
            return column;
        }

        function reset() {
            mark = "";
        }

        function isEmpty() {
            return mark == "";
        }

        return { getRow, getColumn, getMark, setMark, reset, isEmpty }
    }

    function markSpace(coord) {
        let [row, column] = coord;
        const cell = board[row][column];
        if (!cell.isEmpty() || !active) return;
        cell.setMark(currentMark);
        events.emit("boardChanged", board);
        
        empty_spaces--;
        const won = checkWinner(row, column);
        if (!won && empty_spaces == 0) events.emit("draw");
        events.emit("turnEnded");
    }

    function reset() {
        for (row in board) {
            for (col in board[row]) {
                board[row][col].reset();
            }
        }
        empty_spaces = BOARD_SIZE * BOARD_SIZE;
        events.emit("boardChanged", board);
    }

    function checkWinner(x = 1, y = 1) {
        const cell = board[x][y];
        if (cell.isEmpty()) return false;
        const win = function () {
            events.emit("won");
            return true;
        }
    
        // Check row
        const boardRow = board[cell.getRow()];
        if (!boardRow.find(checkRow)) return win();
        function checkRow(value) {
            return value.getMark() != cell.getMark();
        }

        // Check column
        const column = cell.getColumn();
        if (!board.find(checkColumn)) return win();
        function checkColumn(row) {
            return row[column].getMark() != cell.getMark();
        }

        // Check diagonal
        if (!board.find(checkDiagonal)) return win();
        function checkDiagonal(row, index) {
            return row[index].getMark() != cell.getMark();
        }

        // Check other diagonal
        if (!board.find(checkReverseDiagonal)) return win();
        function checkReverseDiagonal(row, index) {
            return checkDiagonal(row, (BOARD_SIZE - 1 - index));
        }

        return false;
    }
})();

const gamePlayers = (function () {
    // Module to handle the game interactions
    const players = [];
    let currentPlayer = 0;

    init();

    function init() {
        events.on("restart", reset);
        events.on("won", roundWon);
        events.on("turnEnded", nextPlayer);
        events.on("addPlayer", addPlayer);
    }

    function roundWon() {
        getCurrentPlayer().increaseScore();
        events.emit("scoreChanged", getScores());
    }

    function addPlayer(name) {
        if (players.length > NUMBER_OF_PLAYERS) return;

        const mark = PLAYERS_MARKS[players.length];
        let score = 0;
        
        function getScore() {
            return score;
        }
        
        function increaseScore() {
            score++;
            events.emit("scoreChanged", getScores());
        }

        function resetScore() {
            score = 0;
        }

        function getName() {
            return name;
        }

        function setName(newName) {
            name = newName;
            events.emit("nameChanged");
        }

        function getMark() {
            return mark;
        }

        const player = { getName, setName, getMark, getScore, increaseScore, resetScore };
        players.push(player);
        events.emit("playerAdded", players);
        if (players.length == NUMBER_OF_PLAYERS) events.emit("startGame");
    }

    function reset() {
        players.forEach( player => player.resetScore() );
        currentPlayer = 0;
        events.emit("playerChanged", currentPlayer);
        events.emit("scoreChanged", getScores());
    }

    function nextPlayer() {
        currentPlayer++;
        if (currentPlayer == NUMBER_OF_PLAYERS) currentPlayer = 0;
        events.emit("playerChanged", currentPlayer);
    }

    function getCurrentPlayer() {
        return players[currentPlayer];
    }

    function getScores() {
        const scores = [];
        players.forEach(player => {
            scores.push(player.getScore());
        });
        console.log(scores);
        return scores;
    }
})();
