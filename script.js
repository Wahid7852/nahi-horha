console.log("Welcome to the game");

const gamestartbutton = document.querySelector(".start-game");
const cover_game = document.querySelector(".cover-game");
const container = document.querySelector(".container");
gamestartbutton.addEventListener("click", () => {
    cover_game.classList.add("active");
    container.classList.remove("active");
});

let currentPlayer = 1; // Tracks the current player (Player 1 starts)
let firstPlayerName, secondPlayerName, firstPlayerColor, secondPlayerColor;

const gameboard = document.querySelector(".connect-4-game");
const cells = document.querySelectorAll(".cell");
const winningbox = document.querySelector(".winning-box");
const winnerbackground = document.querySelector(".winning-box-background");
const winnerbox = document.querySelector(".winning-box");
const winnerplay = document.querySelector(".winner-play");
const restartgame = document.querySelector(".restart");
const winnername = document.querySelector(".winner-name");

// Create an array to keep track of the hover coins
const hoverCoins = new Array(7).fill(null);

// Create a 2D array to track the game state
const rows = 6;
const columns = 7;
const coins = Array.from({ length: rows }, () => Array(columns).fill(0));

const firstname = document.querySelector(".firstname");
const secondname = document.querySelector(".secondname");
const firstcolor = document.querySelector(".firstcolor");
const secondcolor = document.querySelector(".secondcolor");
const form = document.querySelector(".form");
const gamebody = document.querySelector(".game-body");
const playerchance = document.querySelector(".playerchance");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    formvalidate();
});

const errors = (element, message) => {
    const inputcontrol = element.parentElement;
    inputcontrol.classList.add("error");
    inputcontrol.classList.remove("success");

    const mssbox = inputcontrol.querySelector(".error");
    mssbox.innerText = message;
};

const success = (element) => {
    const inputcontrol = element.parentElement;
    inputcontrol.classList.remove("error");
    inputcontrol.classList.add("success");

    const mssbox = inputcontrol.querySelector(".error");
    mssbox.innerText = "";
};

const formvalidate = () => {
    let firstplayer = document.querySelector(".firstplayer");
    let secondplayer = document.querySelector(".secondplayer");
    let color1_box = document.querySelector(".color1");
    let color2_box = document.querySelector(".color2");
    let player1 = firstname.value;
    let player2 = secondname.value;
    let color1 = firstcolor.value;
    let color2 = secondcolor.value;

    if (player1 === "") {
        errors(firstname, "Player name is required");
    } else {
        success(firstname);
    }

    if (player2 === "") {
        errors(secondname, "Player name is required");
    } else {
        success(secondname);
    }

    if (color1 === "#000000" || color1 === "#ffffff") {
        errors(firstcolor, "Change color");
    } else {
        success(firstcolor);
    }

    if (color2 === "#000000" || color2 === "#ffffff") {
        errors(secondcolor, "Change color");
    } else {
        success(secondcolor);
    }

    if(player1.length>0 && player2.length>0 && color1 !="#000000" && color2 !="000000" & color1 != color2){
        form.classList.add("active")
        gamebody.classList.remove("active");


        firstPlayerName = player1;
        secondPlayerName = player2;
        firstPlayerColor = color1;
        secondPlayerColor = color2;

        firstplayer.innerText = player1;
        secondplayer.innerText = player2;
        color1_box.style.background = color1;
        color2_box.style.background = color2;

        playerchance.innerText = `${player1}'s turn`;
    }
};

cells.forEach((cell, index) => {
    cell.onmouseenter = () => {
        const column = index % columns; // Calculate column number
        onMouseHoverInCell(column);
    };

    cell.onmouseleave = () => {
        const column = index % columns; // Calculate column number
        removeHoverCoin(column);
    };

    cell.onclick = () => {
        const column = index % columns; // Calculate column number
        onMouseClickInCell(column);
    };
});

function onMouseClickInCell(column) {
    const row = getAvailableRow(column);
    if (row !== -1) {
        const currentColor = currentPlayer === 1 ? firstPlayerColor : secondPlayerColor;
        placeCoin(row, column, currentColor);

        if (checkForWin(row, column, currentColor)) {
            winningbox.textContent = "Winner";
            winningbox.style.background = currentPlayer === 1 ? firstPlayerColor : secondPlayerColor;
            winningbox.style.display = "block";
            return;
        }

        if (checkDraw()) {
            winningbox.textContent = "It's a draw!";
            winningbox.style.background = "#cccccc";
            winningbox.style.display = "block";
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch to the next player
        updatePlayerName(); // Update player's name after the turn changes
        removeHoverCoin(column); // Remove hover coin after placing
    }
}

function updatePlayerName() {
    const playerName = document.querySelector(".playerchance");
    playerName.textContent = currentPlayer === 1 ? `${firstPlayerName}'s turn` : `${secondPlayerName}'s turn`;
}

function getAvailableRow(column) {
    for (let row = rows - 1; row >= 0; row--) {
        if (coins[row][column] === 0) {
            return row;
        }
    }
    return -1; // Column is full
}

function placeCoin(row, column, color) {
    // Update the game state
    coins[row][column] = currentPlayer;

    // Get the cell element and place the coin
    const cellIndex = row * columns + column;
    const cell = cells[cellIndex];
    if (cell) {
        const coin = document.createElement("div");
        coin.className = "coin";
        coin.style.backgroundColor = color;
        cell.appendChild(coin);

        // Position the coin at the top and then animate down
        coin.style.transform = `translateY(-${(rows - row) * 100}%)`; // Start above the top cell
        requestAnimationFrame(() => {
            coin.style.transform = 'translateY(0)'; // Slide down to the correct cell
        });
    }
}

function onMouseHoverInCell(column) {
    // Remove any existing hover coin in the column
    removeHoverCoin(column);

    // Select the top cell of the column
    const topCell = getTopCell(column);

    if (topCell) {
        let coin = document.createElement("div");
        coin.className = "coin hover-coin";
        coin.style.backgroundColor = currentPlayer === 1 ? firstPlayerColor : secondPlayerColor; // Red for Player 1, Green for Player 2
        coin.dataset.placed = false;

        // Add hover coin to the cell and store it
        topCell.appendChild(coin);
        hoverCoins[column] = coin;
    }
}

function getTopCell(column) {
    for (let row = 0; row < rows; row++) {
        const cellIndex = row * columns + column;
        const cell = cells[cellIndex];
        if (cell && !cell.querySelector(".coin")) {
            return cell;
        }
    }
    return null;
}

function removeHoverCoin(column) {
    const coin = hoverCoins[column];
    if (coin && coin.parentElement) {
        coin.parentElement.removeChild(coin);
        hoverCoins[column] = null;
    }
}

function checkForWin(row, column, color) {
    console.log("Checking for win...");
    const win =
        checkHorizontalWin(row, column, color) ||
        checkVerticalWin(row, column, color) ||
        checkDiagonalWin(row, column, color);
    console.log("Win:", win);
    return win;
}

function checkHorizontalWin(row, column, color) {
    console.log("Checking horizontal win...");
    const player = color === firstPlayerColor ? 1 : 2;
    let count = 0;
    for (let c = Math.max(0, column - 3); c <= Math.min(columns - 1, column + 3); c++) {
        if (coins[row][c] === player) {
            count++;
            if (count === 4) {
                console.log("Horizontal win!");
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkVerticalWin(row, column, color) {
    console.log("Checking vertical win...");
    const player = color === firstPlayerColor ? 1 : 2;
    let count = 0;
    for (let r = Math.max(0, row - 3); r <= Math.min(rows - 1, row + 3); r++) {
        if (coins[r][column] === player) {
            count++;
            if (count === 4) {
                console.log("Vertical win!");
                return true;
            }
        } else {
            count = 0;
        }
    }
    return false;
}

function checkDiagonalWin(row, column, color) {
    console.log("Checking diagonal win...");
    const player = color === firstPlayerColor ? 1 : 2;
    let count = 0;

    // Check \ diagonal
    for (let r = row, c = column; r >= 0 && c >= 0; r--, c--) {
        if (coins[r][c] === player) count++;
        else break;
    }
    for (let r = row + 1, c = column + 1; r < rows && c < columns; r++, c++) {
        if (coins[r][c] === player) count++;
        else break;
    }
    if (count >= 4) {
        console.log("Diagonal win (\\)!");
        return true;
    }

    // Check / diagonal
    count = 0;
    for (let r = row, c = column; r >= 0 && c < columns; r--, c++) {
        if (coins[r][c] === player) count++;
        else break;
    }
    for (let r = row + 1, c = column - 1; r < rows && c >= 0; r++, c--) {
        if (coins[r][c] === player) count++;
        else break;
    }
    if (count >= 4) {
        console.log("Diagonal win (/)!");
        return true;
    }

    return false;
}

// Check for a draw
function checkDraw() {
    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            if (coins[row][column] === 0) {
                return false; // If any empty cell is found, the game is not a draw
            }
        }
    }
    return true; // If all cells are filled, it's a draw
}
