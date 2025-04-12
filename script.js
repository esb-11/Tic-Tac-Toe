const gameBoard = (function () {
    // Represent the Tic-Tac-Toe board
    const board = [];
    const NUMBER_OF_ROWS = 3;
    const NUMBER_OF_COLUMNS = 3;

    init();

    function init() {
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            const row = [];
            for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
                row.push(makeBoardSpace(i, j));
            }
            board.push(row);
        }
    }

    function makeBoardSpace(row, column) {
        
        function changeMark(newMark) {
            this.mark = newMark;
        }

        function checkWinner() {
            // Check row

        }

        return { mark: "", changeMark, checkWinner }
    }

    function markSpace(mark, row, column) {
        board[row][column].changeMark(mark);
    }

    function reset() {
        for (x in board) {
            for (y in board[row]) {
                board[x][y].changeMark("");
            }
        }
    }

    function log() {
        console.log(board);
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
