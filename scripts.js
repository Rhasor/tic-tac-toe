const Game = (function(){
    let turn = true;
    let isOn = false;
    let round = 0;

    const placeSymbol = (location) => {
        if (isOn) {
            if (!GameBoard.getCell(location)) {
                if (turn) {
                    DisplayController.displaySymbol(player1.symbol, location);
                    GameBoard.setCell(location, player1.symbol);
                } else {
                    DisplayController.displaySymbol(player2.symbol, location);
                    GameBoard.setCell(location, player2.symbol);
                }
                turn = !turn;
                let winner = GameBoard.checkWinner();
                if (winner) {
                    if (player1.symbol === winner) {
                        player1.win();
                        isOn = false;
                        DisplayController.displayWinner(player1.name);
                    } else if (player2.symbol === winner) {
                        player2.win();
                        isOn = false;
                        DisplayController.displayWinner(player2.name);
                    }
                } else if (GameBoard.isFull()) {
                    DisplayController.displayWinner(null);
                }
            }
        }
    };

    const startGame = () => {
        // Obtiene los nombres de los jugadores
        player1.name = InputManager.getPlayerName(0);
        player2.name = InputManager.getPlayerName(1);

        // Validación de los nombres
        if (!player1.name.trim() || !player2.name.trim()) {
            alert("Please, enter the name of both players.");
            window.location.reload();
            return;
        }
        else
        // Inicializa el juego solo si los nombres son válidos
        GameBoard.resetCells();
        DisplayController.clearCells();
        DisplayController.clearWinner();
        if (round) {
            DisplayController.showScores(player1, player2);
        }
        isOn = true;
        turn = true;
        round++;
    };

    return { placeSymbol, isOn, startGame };
})();

const InputManager = (function(){
    const player1Field = document.getElementById("player1");
    const player2Field = document.getElementById("player2");

    const getPlayerName = (player) => {
        return player ? player2Field.value : player1Field.value;
    };

    const start = document.getElementById("reset-game");
    start.addEventListener("click", (event) => {
        event.preventDefault(); 
        Game.startGame(); 
    });

    const gameButtons = document.querySelectorAll(".game-button");
    gameButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            Game.placeSymbol(e.currentTarget.dataset.button);
        });
    });

    return { getPlayerName };
})();

const DialogController = (function() {
    const handleDescriptionDialog = () => {
        const closeDescriptionButton = document.getElementById("close-description-button");
        const { dialogDescription } = openUserDialog(); 
        dialogDescription.showModal();
        closeDescriptionButton.addEventListener('click', (event) => {
            event.preventDefault();
            dialogDescription.close();
        });
    };

    const openUserDialog = () => {
        const openDescriptionButton = document.getElementById("open-description-button");
        const addUserDialog = document.getElementById("add-user-dialog");
        const dialogDescription = document.getElementById("dialog-description"); 

        openDescriptionButton.addEventListener('click', () => {
            addUserDialog.showModal();
            dialogDescription.close();
        });
        
        return { 
            addUserDialog, 
            dialogDescription 
        };
    };

    const closeUserDialog = () => {
        const closeUserDialogButton = document.getElementById("close-user-dialog-button");
        const userForm = document.getElementById("user-form");
        const { addUserDialog } = openUserDialog();

        closeUserDialogButton.addEventListener('click', (event) => {
            event.preventDefault();
            addUserDialog.close();
            userForm.reset();
        });
    };

    return {
        openUserDialog,
        closeUserDialog,
        handleDescriptionDialog
    };

})();

DialogController.openUserDialog();
DialogController.closeUserDialog();
DialogController.handleDescriptionDialog();

const start = document.getElementById("start");
const gameGrid = document.getElementById("game-grid");
const gameDialog = document.getElementById("game-dialog");
start.addEventListener("click", (event) => {
    const { addUserDialog } = DialogController.openUserDialog();
    gameDialog.showModal();
    event.preventDefault();
    addUserDialog.close();
    Game.startGame();
    
});

const GameBoard = (function() {
    let cells = [];

    const resetCells = () => {
        cells = Array(9).fill(''); // Inicializa las celdas vacías
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  
            [0, 4, 8], [2, 4, 6]              
        ];

        for (const [a, b, c] of winningCombinations) {
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                return cells[a]; // Devuelve el símbolo ganador (X u O)
            }
        }

        return null; // No hay ganador
    };

    const getCell = (location) => cells[location];

    const setCell = (location, symbol) => {
        if (!cells[location]) { // Verifica que la celda esté vacía
            cells[location] = symbol;
        }
    };

    const isFull = () => cells.every(cell => cell !== '');

    return {
        resetCells,
        checkWinner,
        getCell,
        setCell,
        isFull
    };
})();


// Función para crear jugadores
function createPlayer(name, symbol) {
    let score = 0; 

    return {
        name,
        symbol,
        getScore: () => score,  // Devuelve la puntuación actual
        win: () => score++,     // Incrementa la puntuación
        resetScore: () => score = 0 // Reinicia la puntuación
    };
}

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

const DisplayController = (function () {
    const gameButtons = document.querySelectorAll(".game-button");
    const winnerDiv = document.querySelector(".winner");
    const winnerText = document.createElement("h3");

    const clearCells = () => {
        gameButtons.forEach(button => {
            button.textContent = "";
        });
    };

    const displaySymbol = (symbol, location) => {
        gameButtons[location].textContent = symbol;
    };

    const displayWinner = (winner) => {
        if (winner) {
            winnerText.textContent = `${winner} won!`;
        } else {
            winnerText.textContent = "It's a tie!";
        }
        winnerDiv.innerHTML = "";
        winnerDiv.appendChild(winnerText);
    };

    const clearWinner = () => {
        winnerDiv.innerHTML = "";
    };

    const showScores = (p1, p2) => {
        const scoreDiv = document.querySelector(".scores");
        scoreDiv.innerHTML = ""; 

        const p1Score = document.createElement("p");
        p1Score.textContent = `${p1.name}'s score: ${p1.getScore()}`;
        scoreDiv.appendChild(p1Score);

        const p2Score = document.createElement("p");
        p2Score.textContent = `${p2.name}'s score: ${p2.getScore()}`;
        scoreDiv.appendChild(p2Score);
    };

    return {
        clearCells,
        displaySymbol,
        displayWinner,
        clearWinner,
        showScores
    };
})();


