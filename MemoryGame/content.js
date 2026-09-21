const boardSize = 10;
let boardState = Array(boardSize * boardSize).fill(null);
let isMyTurn = true;

const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

function createBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < boardSize * boardSize; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        
        // الأركان تعتبر جوكر
        if (i === 0 || i === 9 || i === 90 || i === 99) {
            cell.classList.add('corner');
            cell.innerText = '★';
        } else {
            cell.innerText = i + 1;
        }

        cell.onclick = () => handleCellClick(i);
        boardElement.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (!isMyTurn || boardState[index] !== null) return;

    // حركة اللاعب
    boardState[index] = 'player';
    renderBoard();

    if (checkWin('player')) {
        statusElement.innerText = "مبروك! فزت بصف 5 فيشات متتالية! 🎉";
        return;
    }

    isMyTurn = false;
    statusElement.innerText = "دور الخصم يفكر...";

    setTimeout(botTurn, 1000);
}

function botTurn() {
    let emptyCells = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    
    if (emptyCells.length > 0) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardState[randomIndex] = 'bot';
    }

    renderBoard();

    if (checkWin('bot')) {
        statusElement.innerText = "للأسف! فاز الخصم بصف 5 فيشات متتالية. 🤖";
        return;
    }

    isMyTurn = true;
    statusElement.innerText = "دورك الآن - اختر خانة لتضع فيشتك";
}

function renderBoard() {
    const cells = boardElement.children;
    for (let i = 0; i < cells.length; i++) {
        if (boardState[i] === 'player') {
            cells[i].classList.add('player');
        } else if (boardState[i] === 'bot') {
            cells[i].classList.add('bot');
        }
    }
}

function checkWin(owner) {
    // يمكن توسيع دالة التحقق من الصفوف المكتملة هنا
    return false; 
}

createBoard();
