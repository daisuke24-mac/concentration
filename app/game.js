export class Card {
  constructor(id, imageUrl) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.isFlipped = false;
    this.isMatched = false;
  }

  flip() {
    if (!this.isMatched) {
      this.isFlipped = !this.isFlipped;
    }
  }

  match() {
    this.isMatched = true;
    this.isFlipped = true;
  }
}

export class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameStarted = false;
    this.gameEnded = false;
  }

  initializeCards() {
    const allCards = Array.from({ length: 27 }, (_, i) => i + 1);
    const selectedCards = this.shuffleArray(allCards).slice(0, 12);
    
    const gameCards = [...selectedCards, ...selectedCards];
    this.shuffleArray(gameCards);
  
    this.cards = gameCards.map((id, index) => new Card(index, `/kosuke/card_(${id}).jpg`));
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.matchedPairs = 0;
    this.moves = 0;
    this.initializeCards();
  }

  flipCard(cardId) {
    if (this.flippedCards.length === 2) return null;

    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return null;

    card.flip();
    this.flippedCards.push(card);
    this.moves++;

    if (this.flippedCards.length === 2) {
      return this.checkMatch();
    }

    return {
      flippedCard: card,
      isMatch: false,
      isGameOver: false,
      needsFlipBack: false
    };
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.imageUrl === card2.imageUrl;

    if (isMatch) {
      card1.match();
      card2.match();
      this.matchedPairs++;
      this.flippedCards = [];
    }

    const isGameOver = this.matchedPairs === 12;

    if (isGameOver) {
      this.gameEnded = true;
    }

    return {
      flippedCards: [card1, card2],
      isMatch,
      isGameOver,
      needsFlipBack: !isMatch
    };
  }

  flipBackCards() {
    this.flippedCards.forEach(card => card.flip());
    this.flippedCards = [];
  }

  getGameState() {
    return {
      cards: this.cards,
      matchedPairs: this.matchedPairs,
      moves: this.moves,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded
    };
  }
}

let game = null;

export function getGame() {
  if (!game) {
    game = new MemoryGame();
  }
  return game;
}