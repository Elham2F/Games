// تعريف الألوان والبطاقات بالثيم السعودي
const colors = ['أخضر', 'رملي', 'طيني', 'بحري'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ديور', 'سيفون', '+2'];
let deck = [];

// كائنات لتخزين أوراق اللاعبين
let players = {
    player1: [],
    player2: []
};

// ربط الألوان البرمجية بأسماء الكلاسات الموجودة في ملف CSS
const colorClasses = {
    'أخضر': 'color-green',
    'رملي': 'color-sand',
    'طيني': 'color-mud',
    'بحري': 'color-sea',
    'أسود': 'color-black'
};

// 1. وظيفة إنشاء مجموعة الأوراق
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

// 2. وظيفة خلط الأوراق
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

// 3. وظيفة توزيع الأوراق
function dealCards() {
    for (let i = 0; i < 7; i++) {
        players.player1.push(deck.pop());
        players.player2.push(deck.pop());
    }
}

// 4. الوظيفة الجديدة: رسم البطاقات على الشاشة
function renderGame() {
    // رسم أوراق الخصم (بالأعلى - مقلوبة)
    const opponentHand = document.getElementById('opponent-hand');
    players.player2.forEach(card => {
        let cardDiv = document.createElement('div');
        cardDiv.className = 'card card-back';
        cardDiv.innerText = 'أونو';
        opponentHand.appendChild(cardDiv);
    });

    // رسم أوراقك (بالأسفل - مكشوفة بالألوان السعودية)
    const myHand = document.getElementById('my-hand');
    players.player1.forEach(card => {
        let cardDiv = document.createElement('div');
        // إعطاء البطاقة لونها المخصص من الـ CSS
        cardDiv.className = `card ${colorClasses[card.color]}`;
        
        // رسم الدائرة الداخلية للبطاقة
        let innerDiv = document.createElement('div');
        innerDiv.className = 'card-inner';
        innerDiv.innerText = card.value;
        
        cardDiv.appendChild(innerDiv);
        myHand.appendChild(cardDiv);
    });

    // سحب ورقة البداية للمنتصف
    const activeCardArea = document.getElementById('active-card');
    let startCard = deck.pop();
    
    // التأكد أن ورقة البداية ليست أكشن سوداء
    while(startCard.color === 'أسود') {
        deck.unshift(startCard);
        startCard = deck.pop();
    }
    
    let startCardDiv = document.createElement('div');
    startCardDiv.className = `card ${colorClasses[startCard.color]}`;
    let innerStartDiv = document.createElement('div');
    innerStartDiv.className = 'card-inner';
    innerStartDiv.innerText = startCard.value;
    startCardDiv.appendChild(innerStartDiv);
    activeCardArea.appendChild(startCardDiv);

    // تنسيق شكل بطاقة "السحبة"
    const drawPile = document.getElementById('draw-pile');
    drawPile.className = 'card card-back';
}

// تشغيل اللعبة الأساسية
function startGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    renderGame(); // استدعاء دالة الرسم الجديدة
}

startGame();
