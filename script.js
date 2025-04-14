const events = (function() {
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

const gameBoard = (function () {
    // Represent the Tic-Tac-Toe board
    const board = [];
    const BOARD_SIZE = 3;
    let empty_spaces = BOARD_SIZE * BOARD_SIZE;

    init();

    function init() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            const row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push(makeBoardSpace(i, j));
            }
            board.push(row);
        }
        events.on("won", reset);
        events.on("draw", reset);
        events.on("restart", reset);
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

    function markSpace(mark, row, column) {
        const cell = board[row][column];
        if (!cell.isEmpty()) return;
        cell.setMark(mark);
        
        events.emit("boardChanged", board);        
        empty_spaces--;
        const won = checkWinner(row, column);
        if (!won && empty_spaces == 0) events.emit("draw");
    }

    function reset() {
        for (row in board) {
            for (col in board[row]) {
                board[row][col].reset();
            }
        }
        empty_spaces = BOARD_SIZE * BOARD_SIZE;
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

    return { markSpace, reset };
})();

const gamePlayers = (function () {
    // Module to handle the game interactions
    const NUMBER_OF_PLAYERS = 2;
    const players = [];
    let currentPlayer = 0;

    init();

    function init() {
        events.on("restart", resetScore);
    }

    function addPlayer(name, mark) {
        if (players.length > NUMBER_OF_PLAYERS) return;

        let score = 0;
        
        function getScore() {
            return score;
        }
        
        function increaseScore() {
            score++;
        }

        function resetScore() {
            score = 0;
        }

        function getName() {
            return name;
        }

        function setName(newName) {
            name = newName;
        }

        function getMark() {
            return mark;
        }

        function setMark(newMark) {
            mark = newMark;
        }

        const player = { getName, setName, getMark, setMark, getScore, increaseScore, resetScore };
        players.push(player);
        events.emit("playerAdded", players);
    }

    function resetScore() {
        players.forEach( player => player.resetScore() );
        gameBoard.reset();
    }

    function nextPlayer() {
        currentPlayer = (currentPlayer == (NUMBER_OF_PLAYERS - 1) ? 0 : currentPlayer + 1);
    }

    function getCurrentPlayer() {
        return players[currentPlayer];
    }

    function getScores() {
        const scores = {};
        players.forEach(player => {
            scores[player.getName()] = player.getScore();
        });
        return scores;
    }

    return { addPlayer, nextPlayer, resetScore, getCurrentPlayer, getScores };
})();
