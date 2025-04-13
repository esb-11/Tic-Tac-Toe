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

        return { getRow, getColumn, getMark, setMark }
    }

    function markSpace(mark, row, column) {
        const cell = board[row][column]
        cell.setMark(mark);
        if (checkWinner(cell)) console.log("GAME WON!");
    }

    function reset() {
        for (x in board) {
            for (y in board[row]) {
                board[x][y].setMark("");
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

    function checkWinner(cell) {
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

    return { markSpace, reset, log };
})();

const game = (function () {
    // Module to handle the game interactions

    return {};
})();

function makePlayer() {
    // Player factory function

    return {};
};
