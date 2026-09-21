// 1. Define your theme here! 
// You can replace these with anything: animals, flags, or even image URLs.
const themeItems = ['🐪', '🌴', '☕', '🦅', '⛺', '🐎', '🗡️', '🏜️'];

// Duplicate the array to create pairs (16 cards total)
const cardsArray = [...themeItems, ...themeItems]; 
@@ -112,4 +112,4 @@ function resetBoard() {
}

// Start the game when the page loads
initGame();
