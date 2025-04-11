const board = (function () {
    // Represent the Tic-Tac-Toe board
    const boardArray = [[], [], []];

    init();

    function init() {
        for (row in boardArray) {
            for (let i = 0; i< 3; i++) {
                // Create board, 3 by 3 bidmensional array
                boardArray[row].push(makeBoardSpace());
                boardArray[row][i].changeMark(( i % 2 == 0 ? "X" : "O"));
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
        console.log(boardArray);
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
