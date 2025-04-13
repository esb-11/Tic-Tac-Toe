const gameBoard = (function () {
    // Represent the Tic-Tac-Toe board
    const board = [];
    const BOARD_SIZE = 3;

    init();

    function init() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            const row = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                row.push(makeBoardSpace(i, j));
            }
            board.push(row);
        }
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
        const cell = board[row][column]
        cell.setMark(mark);
    }

    function reset() {
        for (row in board) {
            for (col in board[row]) {
                board[row][col].reset();
            }
        }
    }

    function log() {
        board.forEach((row) => {
            const arr = [];
            row.forEach((cell) => {
                arr.push(cell.getMark());
            });
            console.log(arr);
        });
    }

    function checkWinner(x = 1, y = 1) {
        const cell = board[x][y];
        if (cell.isEmpty()) return false;
        
        // Check row
        const boardRow = board[cell.getRow()];
        if (!boardRow.find(checkRow)) return true;

        function checkRow(value) {
            return value.getMark() != cell.getMark();
        }

        // Check column
        const column = cell.getColumn();
        if (!board.find(checkColumn)) return true;

        function checkColumn(row) {
            return row[column].getMark() != cell.getMark();
        }

        // Check diagonal
        if (!board.find(checkDiagonal)) return true;

        function checkDiagonal(row, index) {
            return row[index].getMark() != cell.getMark();
        }

        // Check other diagonal
        if (!board.find(checkReverseDiagonal)) return true;

        function checkReverseDiagonal(row, index) {
            return checkDiagonal(row, (BOARD_SIZE - 1 - index));
        }
    }

    return { markSpace, reset, checkWinner, log };
})();

const game = (function () {
    // Module to handle the game interactions
    const NUMBER_OF_PLAYERS = 2;
    const players = [];

    return { addPlayer, playRound, restart };
})();
