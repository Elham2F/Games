const colors = ['أخضر', 'رملي', 'طيني', 'بحري'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ريوس', 'استريح', '+2'];
let deck = [];

let players = {
    player1: [], // أوراقك
    player2: []  // أوراق الخصم
};

let activeCard = null; 
let pendingCardIndex = -1;
let isMyTurn = true; // تحديد دور مَن للعب

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

function playCard(index) {
    if (!isMyTurn) return; // منعك من اللعب إذا كان دور الخصم

    let selectedCard = players.player1[index];
    
    if (selectedCard.color === 'أسود') {
        pendingCardIndex = index; 
        document.getElementById('color-picker-modal').classList.remove('hidden'); 
        return; 
    }

    if (selectedCard.color === activeCard.color || selectedCard.value === activeCard.value) {
        activeCard = selectedCard;
        players.player1.splice(index, 1);
        renderGame(); 
        
        if (checkWin()) return;

        // انتقال الدور للخصم
        isMyTurn = false;
        setTimeout(botTurn, 1000); // الخصم يفكر ويلعب بعد ثانية واحدة
    } else {
        alert("ما تقدر تلعب هذي الورقة! لازم نفس اللون أو نفس الرقم.");
    }
}

function selectColor(chosenColor) {
    let selectedCard = players.player1[pendingCardIndex];
    
    activeCard = { color: chosenColor, value: selectedCard.value }; 
    players.player1.splice(pendingCardIndex, 1);
    
    document.getElementById('color-picker-modal').classList.add('hidden'); 
    pendingCardIndex = -1;
    
    renderGame(); 
    if (checkWin()) return;

    // انتقال الدور للخصم
    isMyTurn = false;
    setTimeout(botTurn, 1000);
}

function drawCard() {
    if (!isMyTurn) return;

    if(deck.length > 0) {
        players.player1.push(deck.pop());
        renderGame();
        
        // بعد السحب ينتقل الدور للخصم
        isMyTurn = false;
        setTimeout(botTurn, 1000);
    }
}

// ذكاء اصطناعي لبوت الخصم
function botTurn() {
    let validCardIndex = players.player2.findIndex(card => 
        card.color === activeCard.color || 
        card.value === activeCard.value || 
        card.color === 'أسود'
    );

    if (validCardIndex !== -1) {
        let cardToPlay = players.player2[validCardIndex];

        if (cardToPlay.color === 'أسود') {
            // البوت يختار اللون الأكثر توفراً في يده
            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            activeCard = { color: randomColor, value: cardToPlay.value };
        } else {
            activeCard = cardToPlay;
        }

        players.player2.splice(validCardIndex, 1);
    } else {
        // إذا لم يجد ورقة، يسحب ورقة من الكوم
        if (deck.length > 0) {
            players.player2.push(deck.pop());
        }
    }

    renderGame();

    if (!checkWin()) {
        isMyTurn = true; // إعادة الدور لكِ
    }
}

function checkWin() {
    if (players.player1.length === 0) {
        alert("مبروك! فزت في اللعبة! 🎉");
        return true;
    } else if (players.player2.length === 0) {
        alert("للأسف فاز الخصم! حظاً أوفر في المرة القادمة. 🤖");
        return true;
    }
    return false;
}

function startGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderGame();
}

startGame();
