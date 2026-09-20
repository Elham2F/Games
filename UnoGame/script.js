const colors = ['أخضر', 'رملي', 'طيني', 'بحري'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ديور', 'سيفون', '+2'];
let deck = [];

let players = {
    player1: [],
    player2: []
};

// متغير لحفظ الورقة المكشوفة حالياً في المنتصف
let activeCard = null; 

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
    
    // سحب ورقة البداية للمنتصف
    activeCard = deck.pop();
    while(activeCard.color === 'أسود') {
        deck.unshift(activeCard);
        activeCard = deck.pop();
    }
}

function renderGame() {
    // تنظيف الطاولة قبل إعادة ترتيب الأوراق
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
        
        // هنا السر: تفعيل الضغط على بطاقاتك لرميها
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

    // تفعيل الضغط على السحبة
    const drawPile = document.getElementById('draw-pile');
    drawPile.className = 'card card-back';
    drawPile.onclick = drawCard;
}

// دالة التحقق ورمي الورقة
function playCard(index) {
    let selectedCard = players.player1[index];
    
    // قوانين الأونو: لازم نفس اللون، أو نفس الرقم، أو ورقة سوداء
    if (selectedCard.color === activeCard.color || selectedCard.value === activeCard.value || selectedCard.color === 'أسود') {
        
        // استبدال ورقة المنتصف بالورقة التي اخترتها
        activeCard = selectedCard;
        // حذف الورقة من يدك
        players.player1.splice(index, 1);
        
        renderGame(); // تحديث الطاولة
        
        checkWin();
        
        // لاحقاً سنضيف هنا برمجة (دور الخصم) ليلعب تلقائياً
    } else {
        alert("ما تقدر تلعب هذي الورقة! لازم نفس اللون أو نفس الرقم.");
    }
}

// دالة سحب ورقة جديدة
function drawCard() {
    if(deck.length > 0) {
        players.player1.push(deck.pop());
        renderGame(); // تحديث الطاولة لظهور الورقة الجديدة في يدك
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
