const gameBoard = (function () {
    // Represent the Tic-Tac-Toe board
    const board = [[], [], []];

    init();

    function init() {
        for (row in board) {
            for (let i = 0; i< 3; i++) {
                // Create board, 3 by 3 bidmensional array
                board[row].push(makeBoardSpace());
            }
        }
    }

    function makeBoardSpace() {
        function changeMark(newMark) {
            this.mark = newMark;
        }
        return { mark: "", changeMark }
    }

    function markSpace(marker, coord) {

    }

    function reset() {

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
