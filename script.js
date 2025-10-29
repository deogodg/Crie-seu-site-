const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const resetScoreButton = document.getElementById('reset-score');
const toggleModeButton = document.getElementById('toggle-mode');
const jumpscare = document.getElementById('jumpscare');
const jumpscareSound = document.getElementById('jumpscare-sound');
const enableJumpscare = document.getElementById('enable-jumpscare');
let currentPlayer = '👻'; // Fantasma
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let ghostScore = 0;
let pumpkinScore = 0;
let isVsAI = false; // Modo IA desativado por padrão

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
        
        // Incrementa o placar
        if (currentPlayer === '👻') {
            ghostScore++;
            document.getElementById('ghost-score').textContent = ghostScore;
            // Jumpscare no PvP quando o placar do Fantasma chegar a 5
            if (enableJumpscare.checked && !isVsAI && ghostScore === 5) {
                triggerJumpscare();
            }
        } else {
            pumpkinScore++;
            document.getElementById('pumpkin-score').textContent = pumpkinScore;
            // Jumpscare no PvP quando o placar da Abóbora chegar a 5
            if (enableJumpscare.checked && !isVsAI && pumpkinScore === 5) {
                triggerJumpscare();
            }
        }
        
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== '')) {
        message.textContent = '💀 Empate! Tente novamente.';
        gameActive = false;
        return;
    }

    // Alterna para o próximo jogador
    currentPlayer = currentPlayer === '👻' ? '🎃' : '👻';
    message.textContent = `Vez do ${currentPlayer === '👻' ? 'Fantasma 👻' : 'Abóbora 🎃'}`;

    // Se for PvAI e for a vez da IA, chama a função AI
    if (isVsAI && gameActive && currentPlayer === '🎃') {
        setTimeout(aiMove, 500); // Delay para simular pensamento
    }
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
    // Se PvAI, inicia com jogador humano
    if (isVsAI && currentPlayer === '🎃') {
        setTimeout(aiMove, 500);
    }
}

function resetScoreboard() {
    ghostScore = 0;
    pumpkinScore = 0;
    document.getElementById('ghost-score').textContent = '0';
    document.getElementById('pumpkin-score').textContent = '0';
}

function toggleMode() {
    isVsAI = !isVsAI;
    toggleModeButton.textContent = isVsAI ? '👥 Alternar Modo (PvAI)' : '🤖 Alternar Modo (PvP)';
    resetGame(); // Reseta o jogo ao alternar modo
}

function aiMove() {
    if (!gameActive) return;
    const emptyCells = board.map((val, idx) => val === '' ? idx : null).filter(idx => idx !== null);
    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = '🎃';
        cells[randomIndex].textContent = '🎃';
        
        // Verifica vitória/empate após movimento da IA
        if (checkWinner()) {
            const winningCells = getWinningCells();
            winningCells.forEach(index => cells[index].classList.add('winner'));
            message.classList.add('winner');
            message.textContent = `🎉 Abóbora venceu! 👻🎃`;
            pumpkinScore++;
            document.getElementById('pumpkin-score').textContent = pumpkinScore;
            // Jumpscare na derrota do fantasma (IA venceu)
            if (enableJumpscare.checked) {
                triggerJumpscare();
            }
            gameActive = false;
            return;
        }
        
        if (board.every(cell => cell !== '')) {
            message.textContent = '💀 Empate! Tente novamente.';
            gameActive = false;
            return;
        }
        
        // Alterna de volta para o jogador humano
        currentPlayer = '👻';
        message.textContent = 'Vez do Fantasma 👻';
    }
}

function triggerJumpscare() {
    jumpscare.style.display = 'flex';
    jumpscareSound.play(); // Toca o som
    setTimeout(() => {
        jumpscare.style.display = 'none';
    }, 2000); // Desaparece após 2 segundos
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
resetScoreButton.addEventListener('click', resetScoreboard);
toggleModeButton.addEventListener('click', toggleMode);

