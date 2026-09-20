const colors = ['أخضر', 'رملي', 'طيني', 'بحري'];
// تم تحديث أسماء بطاقات الأكشن باللهجة السعودية كما اتفقنا
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ريوس', 'استريح', '+2'];
let deck = [];

let players = {
    player1: [],
    player2: []
};

let activeCard = null; 
let pendingCardIndex = -1; // لحفظ موقع الورقة السوداء مؤقتاً

const colorClasses = {
    'أخضر': 'color-green',
    'رملي': 'color-sand',
    'طيني': 'color-mud',
    'بحري': 'color-sea',
    'أسود': 'color-black'
};

function buildDeck() {
    deck = [];
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({ color: colors[i], value: values[j] });
            if (values[j] !== '0') {
                deck.push({ color: colors[i], value: values[j] });
            }
        }
    }
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'أسود', value: 'على كيفي' });
        deck.push({ color: 'أسود', value: '+4' });
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function dealCards() {
    for (let i = 0; i < 7; i++) {
        players.player1.push(deck.pop());
        players.player2.push(deck.pop());
    }
    
    activeCard = deck.pop();
    while(activeCard.color === 'أسود') {
        deck.unshift(activeCard);
        activeCard = deck.pop();
    }
}

function renderGame() {
    document.getElementById('opponent-hand').innerHTML = '';
    document.getElementById('my-hand').innerHTML = '';
    document.getElementById('active-card').innerHTML = '';

    const opponentHand = document.getElementById('opponent-hand');
    players.player2.forEach(card => {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'card card-back';
        cardDiv.innerText = 'أونو';
        opponentHand.appendChild(cardDiv);
    });

    const myHand = document.getElementById('my-hand');
    players.player1.forEach((card, index) => {
        let cardDiv = document.createElement('div');
        cardDiv.className = `card ${colorClasses[card.color]}`;
        
        let innerDiv = document.createElement('div');
        innerDiv.className = 'card-inner';
        innerDiv.innerText = card.value;
        
        cardDiv.appendChild(innerDiv);
        cardDiv.onclick = () => playCard(index);
        
        myHand.appendChild(cardDiv);
    });

    const activeCardArea = document.getElementById('active-card');
    let startCardDiv = document.createElement('div');
    startCardDiv.className = `card ${colorClasses[activeCard.color]}`;
    let innerStartDiv = document.createElement('div');
    innerStartDiv.className = 'card-inner';
    innerStartDiv.innerText = activeCard.value;
    startCardDiv.appendChild(innerStartDiv);
    activeCardArea.appendChild(startCardDiv);

    const drawPile = document.getElementById('draw-pile');
    drawPile.className = 'card card-back';
    drawPile.onclick = drawCard;
}

// دالة اللعب الأساسية (مع دعم أزرار الألوان للبطاقات السوداء)
function playCard(index) {
    let selectedCard = players.player1[index];
    
    if (selectedCard.color === 'أسود') {
        pendingCardIndex = index; 
        document.getElementById('color-picker-modal').classList.remove('hidden'); // إظهار نافذة الأزرار
        return; 
    }

    if (selectedCard.color === activeCard.color || selectedCard.value === activeCard.value) {
        activeCard = selectedCard;
        players.player1.splice(index, 1);
        renderGame(); 
        checkWin();
    } else {
        alert("ما تقدر تلعب هذي الورقة! لازم نفس اللون أو نفس الرقم.");
    }
}

// دالة اختيار اللون عبر الأزرار
function selectColor(chosenColor) {
    let selectedCard = players.player1[pendingCardIndex];
    
    activeCard = { color: chosenColor, value: selectedCard.value }; 
    players.player1.splice(pendingCardIndex, 1);
    
    document.getElementById('color-picker-modal').classList.add('hidden'); // إخفاء نافذة الأزرار
    pendingCardIndex = -1;
    
    renderGame(); 
    checkWin();
}

function drawCard() {
    if(deck.length > 0) {
        players.player1.push(deck.pop());
        renderGame();
    }
}

function checkWin() {
    if(players.player1.length === 0) {
        alert("مبروك! أنت فزت!");
    }
}

function startGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderGame();
}

startGame();
