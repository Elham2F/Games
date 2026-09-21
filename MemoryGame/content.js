// 1. Define your theme here! 
// You can replace these with anything: animals, flags, or even image URLs.
const themeItems = ['🐪', '🌴', '☕', '🦅', '⛺', '🐎', '🗡️', '🏜️'];

// Duplicate the array to create pairs (16 cards total)
const cardsArray = [...themeItems, ...themeItems]; 

// Game State variables
let firstCard = null;
let secondCard = null;
let lockBoard = false; // Prevents clicking while cards are flipping back
let matchedPairs = 0;

const gameBoard = document.getElementById('game-board');

// Shuffle function (Fisher-Yates Algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the game
function initGame() {
    gameBoard.innerHTML = '';
    matchedPairs = 0;

    const shuffledCards = shuffle(cardsArray);

    shuffledCards.forEach(item => {
        // Create card container
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = item; // Store the item name to check for matches

        // Create front face (hidden side)
        const front = document.createElement('div');
        front.classList.add('front');

        // Create back face (revealed side)
        const back = document.createElement('div');
        back.classList.add('back');
        back.innerText = item; // Add the emoji to the card

        // Append faces to card, and card to board
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });
}

// Handle card click
function flipCard() {
    if (lockBoard) return; // Don't allow clicking if board is locked
    if (this === firstCard) return; // Prevent double-clicking the same card

    this.classList.add('flipped');

    if (!firstCard) {
        // First click
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    checkForMatch();
}

// Check if the two clicked cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// If it's a match, remove click events and check for win
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs++;
    if (matchedPairs === themeItems.length) {
        setTimeout(() => alert('Congratulations! You won! 🎉'), 500);
    }

    resetBoard();
}

// If it's not a match, flip them back after a short delay
function unflipCards() {
    lockBoard = true; // Lock the board so user can't click other cards

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // 1000 milliseconds = 1 second
}

// Reset variables for the next turn
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Start the game when the page loads
initGame();
