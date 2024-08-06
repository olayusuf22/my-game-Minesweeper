document.getElementById('startButton').addEventListener('click', startGame);
let message = document.getElementById('Message');
function startGame() {
    const rows = parseInt(document.getElementById('rows').value);
    const columns = parseInt(document.getElementById('columns').value);
    const numMines = parseInt(document.getElementById('mines').value);

    const board = initializeBoard(rows, columns, numMines);
    renderBoard(board);
}

function initializeBoard(rows, columns, numMines) {
    let board = Array.from({ length: rows }, () => Array(columns).fill(' '));
    placeMines(board, numMines);
    calculateAdjacentMines(board);
    return board;
}

function placeMines(board, numMines) {
    const rows = board.length;
    const columns = board[0].length;
    while (numMines > 0) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * columns);
        if (board[randomRow][randomCol] !== 'M') {
            board[randomRow][randomCol] = 'M';
            numMines--;
        }
    }
}

function calculateAdjacentMines(board) {
    const rows = board.length;
    const columns = board[0].length;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] !== 'M') {
                let mineCount = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < columns) {
                            if (board[row + i][col + j] === 'M') {
                                mineCount++;
                            }
                        }
                    }
                }
                board[row][col] = mineCount === 0 ? ' ' : mineCount.toString();
            }
        }
    }
}

function renderBoard(board) {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let row = 0; row < board.length; row++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        for (let col = 0; col < board[row].length; col++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.dataset.row = row;
            cellElement.dataset.col = col;
            cellElement.addEventListener('click', () => revealCell(board, row, col));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                markCell(board, row, col);
            });
            rowElement.appendChild(cellElement);
        }
        boardElement.appendChild(rowElement);
    }
}

function revealCell(board, row, col) {
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cellElement.classList.contains('revealed')) return;

    cellElement.classList.add('revealed');
    if (board[row][col] === 'M') {
        cellElement.classList.add('mine');
        cellElement.textContent = 'M';
        gameOver(board);
    } else {
        cellElement.textContent = board[row][col];
        if (board[row][col] === ' ') {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (row + i >= 0 && row + i < board.length && col + j >= 0 && col + j < board[0].length) {
                        revealCell(board, row + i, col + j);
                    }
                }
            }
        }
    }
    if (checkWin(board)) {
        message.innerText ='Congratulations! You won!'
        revealAllMines(board);
    }
}

function markCell(board, row, col) {
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cellElement.classList.contains('revealed')) return;

    if (cellElement.textContent === 'F') {
        cellElement.textContent = '';
    } else {
        cellElement.textContent = 'F';
    }
}

function checkWin(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (board[row][col] !== 'M' && !cellElement.classList.contains('revealed')) {
                return false;
            }
        }
    }
    return true;
}

function gameOver(board) {
    message.innerText ='You hit a mine! Game Over.'
    revealAllMines(board);
}

function revealAllMines(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'M') {
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cellElement.classList.add('revealed', 'mine');
                cellElement.textContent = 'M';
            }
        }
    }
}
