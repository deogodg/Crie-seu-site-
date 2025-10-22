const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let currentPlayer = '👻'; // Fantasma
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        // Adiciona animação às células vencedoras
        const winningCells = getWinningCells();
        winningCells.forEach(index => cells[index].classList.add('winner'));
        
        // Adiciona animação à mensagem
        message.classList.add('winner');
        message.textContent = `🎉 ${currentPlayer === '👻' ? 'Fantasma' : 'Abóbora'} venceu! 👻🎃`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        message.textContent = '💀 Empate! Tente novamente.';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === '👻' ? '🎃' : '👻';
    message.textContent = `Vez do ${currentPlayer === '👻' ? 'Fantasma 👻' : 'Abóbora 🎃'}`;
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function getWinningCells() {
    // Retorna os índices das células vencedoras
    for (let condition of winningConditions) {
        if (condition.every(index => board[index] === currentPlayer)) {
            return condition;
        }
    }
    return [];
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = '👻';
    message.textContent = 'Vez do Fantasma 👻';
    message.classList.remove('winner'); // Remove animação da mensagem
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner'); // Remove animação das células
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);