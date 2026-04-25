const grid = document.getElementById("grid");

// Create grid
for (let i = 0; i < 81; i++) {
    let input = document.createElement("input");
    input.setAttribute("maxlength", "1");
    input.dataset.index = i;

    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^1-9]/g, "");
        validateAll();

        // Auto move forward
        if (input.value !== "" && i < 80) {
            document.querySelectorAll("#grid input")[i + 1].focus();
        }
    });

    // 🔥 Arrow key navigation
    input.addEventListener("keydown", (e) => {
        let inputs = document.querySelectorAll("#grid input");
        let row = Math.floor(i / 9);
        let col = i % 9;

        switch (e.key) {
            case "ArrowRight":
                if (col < 8) inputs[i + 1].focus();
                break;

            case "ArrowLeft":
                if (col > 0) inputs[i - 1].focus();
                break;

            case "ArrowDown":
                if (row < 8) inputs[i + 9].focus();
                break;

            case "ArrowUp":
                if (row > 0) inputs[i - 9].focus();
                break;

            case "Backspace":
                if (input.value === "" && i > 0) {
                    inputs[i - 1].focus();
                }
                break;
        }
    });

    grid.appendChild(input);
}

// Get grid
function getGrid() {
    let inputs = document.querySelectorAll("#grid input");
    let board = [];

    for (let i = 0; i < 9; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            let val = inputs[i * 9 + j].value;
            board[i][j] = val ? parseInt(val) : 0;
        }
    }
    return board;
}

// Update cell
function updateCell(row, col, value, highlight = false) {
    let inputs = document.querySelectorAll("#grid input");
    let cell = inputs[row * 9 + col];

    cell.value = value;

    if (highlight) {
        cell.classList.add("solving");
        setTimeout(() => cell.classList.remove("solving"), 200);
    }
}

// Sleep for animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Check valid
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num)
            return false;
    }

    let startRow = row - row % 3;
    let startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num)
                return false;
        }
    }

    return true;
}

// Highlight wrong inputs
function validateAll() {
    let board = getGrid();
    let inputs = document.querySelectorAll("#grid input");

    inputs.forEach((cell, index) => {
        let row = Math.floor(index / 9);
        let col = index % 9;
        let num = board[row][col];

        if (num !== 0) {
            board[row][col] = 0;

            if (!isValid(board, row, col, num)) {
                cell.classList.add("invalid");
            } else {
                cell.classList.remove("invalid");
            }

            board[row][col] = num;
        } else {
            cell.classList.remove("invalid");
        }
    });
}

// Animated solver
async function solveAnimated(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {

                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        updateCell(row, col, num, true);

                        await sleep(30);

                        if (await solveAnimated(board)) return true;

                        board[row][col] = 0;
                        updateCell(row, col, "", true);

                        await sleep(30);
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Solve button
async function solveSudoku() {
    let board = getGrid();
    await solveAnimated(board);
}

// Clear button
function clearGrid() {
    document.querySelectorAll("#grid input").forEach(input => {
        input.value = "";
        input.classList.remove("invalid");
    });
}