(function () {
    // Start with X's turn.
    let isXturn = true;

    let turnIndicatorStr = {
        X: `X's turn:`,
        O: `O's turn:`,
    };

    let cells = [...document.querySelectorAll('.cell')];
    let turnIndicator = document.querySelector('#turn-indicator');
    let dialog = document.querySelector("dialog");

    dialog.querySelector('.btn-primary').onclick = () => { window.location.reload(); };
    dialog.querySelector('.btn-secondary').onclick = () => { dialog.close(); };

    let gameOverText = document.querySelector("#game-over-text");

    // dialog.show();

    let Icons = {
        circle: "icons/O.svg",
        cross: "icons/X.svg",
    };

    function getRows() {
        let root = Math.sqrt(cells.length);
        let rows = [];
        cells.forEach((cell, idx) => {
            let newIdx = Math.trunc(idx / root);
            rows[newIdx] ??= [];
            rows[newIdx].push(cell);
        });
        return rows;
    }

    function getColumns() {
        // https://stackoverflow.com/a/58668351/22831914
        let columns = getRows()[0].map((val, index) => {
            return rows.map(row => {
                return row[row.length - 1 - index];
            });
        }).reverse();
        return columns;
    }

    function getDiagonals() {
        let movingIdx = 0;
        function foo(movingIdx, rowIdx, colIdx) {
            let allMatch = rowIdx == movingIdx && colIdx == movingIdx;
            return allMatch;
        }
        let TLBR = rows.map((row, colIdx) => {
            return row.filter((x, rowIdx) => {
                if (foo(movingIdx, rowIdx, colIdx)) {
                    movingIdx++;
                    return x;
                }
            });
        }).flat();

        movingIdx = 0;
        let reversed = rows.map(x => x.toReversed());

        let TRBL = reversed.map((row, colIdx) => {
            return row.filter((x, rowIdx) => {
                if (foo(movingIdx, rowIdx, colIdx)) {
                    movingIdx++;
                    return x;
                }
            });
        }).flat();

        return { TRBL, TLBR };
    }

    let rows = getRows();
    let columns = getColumns();
    let diagonals = getDiagonals();

    turnIndicator.textContent = turnIndicatorStr.X;

    function checkRows() {
        let winner = "";
        rows.forEach(row => {
            const filtered = row
                .filter(cell => cell.hasAttribute('value'))
                .map(cell => cell.getAttribute('value'));

            if (filtered.length < 3) return;
            const allMatched = filtered.every(x => x == filtered[0]);
            if (allMatched) {
                winner = filtered[0];
            }
        });
        return winner;
    }

    function checkColumns() {
        let winner = "";
        columns.forEach(col => {
            const filtered = col
                .filter(cell => cell.hasAttribute('value'))
                .map(cell => cell.getAttribute('value'));

            if (filtered.length < 3) return;
            const allMatched = filtered.every(x => x == filtered[0]);
            if (allMatched) {
                winner = filtered[0];
            }
        });
        return winner;
    }

    function checkDiagonals() {
        let winner = "";

        let tlbrFiltered = diagonals.TLBR
            .filter(cell => cell.hasAttribute('value'))
            .map(cell => cell.getAttribute('value'));

        let trblFiltered = diagonals.TRBL
            .filter(cell => cell.hasAttribute('value'))
            .map(cell => cell.getAttribute('value'));

        if (trblFiltered.length > 2) {
            let match = trblFiltered.every(x => x == trblFiltered[0]);
            if (match) {
                winner = trblFiltered[0];
            }
        }

        if (tlbrFiltered.length > 2) {
            let match = tlbrFiltered.every(x => x == tlbrFiltered[0]);
            if (match) {
                winner = tlbrFiltered[0];
            }
        }

        return winner;
    }

    function checkStalemate() {
        let filtered = cells.filter(cell => cell.hasAttribute('value'));
        if (filtered.length == cells.length) {
            return true;
        }
    }


    function checkStatus() {
        let rowWin = checkRows();
        let colWin = checkColumns();
        let DiagWin = checkDiagonals();

        let winner = rowWin + colWin + DiagWin;
        if (winner) {
            // alert(winner);
            deinitListeners();
            let str = `${winner} Has won the game, would you like to restart?`;
            gameOverText.textContent = str;
            dialog.show();
        }

        if (checkStalemate() && !(winner)) {
            deinitListeners();
            let str = `Game is a stalemate, would you like to restart?`;
            gameOverText.textContent = str;
            dialog.show();
        }
    }

    function onClick(event) {
        if (
            event.currentTarget !== event.target ||
            event.currentTarget.hasAttribute('clicked')
        ) {
            return;
        }

        let cell = event.currentTarget;

        let img = document.createElement('img');

        if (isXturn) {
            img.src = Icons.cross;
            cell.appendChild(img);
            cell.setAttribute('clicked', '');
            cell.setAttribute('value', 'X');

            isXturn = false;
            turnIndicator.textContent = turnIndicatorStr.O;
        } else {
            img.src = Icons.circle;
            cell.appendChild(img);
            cell.setAttribute('clicked', '');
            cell.setAttribute('value', 'O');

            isXturn = true;
            turnIndicator.textContent = turnIndicatorStr.X;
        }

        checkStatus();
    }

    function initListeners() {
        cells.forEach(x => x.addEventListener('click', onClick));
    }

    function deinitListeners() {
        cells.forEach(x => x.removeEventListener('click', onClick));
    }

    initListeners();

})();
