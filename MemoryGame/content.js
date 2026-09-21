// 1. العناصر والرموز
const themeItems = ['🐪', '🌴', '☕', '🦅', '⛺', '🐎', '🗡️', '🏜️'];
const cardsArray = [...themeItems, ...themeItems]; 

// متغيّرات حالة اللعبة
let firstCard = null;
let secondCard = null;
let lockBoard = false; 
let matchedPairs = 0;

// متغيّرات المؤقت والنتيجة
let timerInterval = null;
let seconds = 0;
let gameStarted = false;

// استدعاء عناصر HTML
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const bestRecordElement = document.getElementById('best-record');
const winModal = document.getElementById('win-modal');
const winTimeText = document.getElementById('win-time-text');

// خلط الكروت (Fisher-Yates Algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// عرض أفضل رقم قياسي مخزن
function loadBestRecord() {
    let bestRecord = localStorage.getItem('saffih_best_record');
    if (bestRecordElement) {
        bestRecordElement.innerText = bestRecord ? `${bestRecord} ثانية` : '--';
    }
}

// بدء المؤقت
function startTimer() {
    seconds = 0;
    if (timerElement) timerElement.innerText = seconds;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        if (timerElement) timerElement.innerText = seconds;
    }, 1000);
}

// إيقاف المؤقت
function stopTimer() {
    clearInterval(timerInterval);
}

// تهيئة وإعادة تشغيل اللعبة
function initGame() {
    // إخفاء نافذة الفوز إذا كانت مفتوحة
    if (winModal) winModal.classList.add('hidden');

    gameBoard.innerHTML = '';
    matchedPairs = 0;
    gameStarted = false;
    stopTimer();
    
    if (timerElement) timerElement.innerText = '0';
    loadBestRecord();
    resetBoard();

    const shuffledCards = shuffle([...cardsArray]);

    shuffledCards.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item;

        const front = document.createElement('div');
        front.classList.add('front');

        const back = document.createElement('div');
        back.classList.add('back');
        back.innerText = item;

        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });
}

// عند النقر على كرت
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    // بدء الوقت مع أول حركة
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// التحقق من تطابق الكرتين
function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// في حال المطابقة
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    
    if (matchedPairs === themeItems.length) {
        setTimeout(handleWin, 500);
    }

    resetBoard();
}

// في حال عدم المطابقة
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        if (firstCard) firstCard.classList.remove('flipped');
        if (secondCard) secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// إرجاع المتغيرات لوضعها الطبيعي
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// عند الفوز وإنهاء اللعبة
function handleWin() {
    stopTimer();

    let currentBest = localStorage.getItem('saffih_best_record');
    let isNewRecord = false;

    if (!currentBest || seconds < parseInt(currentBest)) {
        localStorage.setItem('saffih_best_record', seconds);
        isNewRecord = true;
    }

    let message = `Whoo! You finished the game in ${seconds} seconds!`;
    if (isNewRecord) {
        message += ` 🏆 (أفضل رقم قياسي جديد!)`;
    }

    if (winTimeText) winTimeText.innerText = message;
    if (winModal) winModal.classList.remove('hidden');
    loadBestRecord();
}

// تشغيل اللعبة عند فتح الصفحة
initGame();
