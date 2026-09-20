// تعريف الألوان والبطاقات بالثيم السعودي
const colors = ['أخضر', 'رملي', 'طيني', 'بحري'];
const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ديور', 'سيفون', '+2'];
let deck = [];

// كائنات لتخزين أوراق اللاعبين
let players = {
    player1: [],
    player2: []
};

// 1. وظيفة إنشاء مجموعة الأوراق (108 بطاقة)
function buildDeck() {
    deck = [];
    // إضافة البطاقات الملونة
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({ color: colors[i], value: values[j] });
            // الأرقام من 1 إلى 9 وبطاقات الأكشن تتكرر مرتين لكل لون
            if (values[j] !== '0') {
                deck.push({ color: colors[i], value: values[j] });
            }
        }
    }
    // إضافة بطاقات الأكشن السوداء (4 بطاقات من كل نوع)
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'أسود', value: 'على كيفي' });
        deck.push({ color: 'أسود', value: '+4' });
    }
}

// 2. وظيفة خلط الأوراق (باستخدام خوارزمية Fisher-Yates)
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

// 3. وظيفة توزيع الأوراق (7 بطاقات لكل لاعب)
function dealCards() {
    for (let i = 0; i < 7; i++) {
        // سحب ورقة من آخر المجموعة وإعطائها للاعب
        players.player1.push(deck.pop());
        players.player2.push(deck.pop());
    }
}

// وظيفة رئيسية لبدء اللعبة
function startGame() {
    buildDeck();
    shuffleDeck();
    dealCards();
    
    // طباعة النتائج في موجه الأوامر (Console) للتأكد من عمل الكود
    console.log("أوراق اللاعب الأول:", players.player1);
    console.log("أوراق اللاعب الثاني:", players.player2);
    console.log("الورقة المتبقية في السحبة:", deck.length);
}

// تشغيل اللعبة
startGame();
