'use client'

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const CARD_BACK_IMAGE = '/kosuke/card_back.png';

export default function Home() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    fetchGameState();
  }, []);

  const RandomSoundPlayer = () => {
    const numberOfSounds = 11;
  
    const soundFiles = [];
    for (let i = 1; i <= numberOfSounds; i++) {
      soundFiles.push(`/kosuke/audio_(${i}).mp3`);
    }

    const playRandomSound = () => {
      const randomIndex = Math.floor(Math.random() * soundFiles.length);
      const randomSound = soundFiles[randomIndex];
      const audio = new Audio(randomSound);
      audio.play();
    };

    playRandomSound();

  };

  const fetchGameState = async () => {
    const response = await fetch('/api/game');
    const data = await response.json();
    setGameState(data);
  };

  const startGame = async () => {
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start' })
    });
    const data = await response.json();
    setGameState(data);
  };

  const handleCardClick = async (cardId) => {
    RandomSoundPlayer();
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'flip', cardId })
    });
    const data = await response.json();
    setGameState(prevState => ({ ...prevState, ...data }));

    if (data.needsFlipBack) {
      setTimeout(async () => {
        const flipBackResponse = await fetch('/api/game', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'flipBack' })
        });
        const flipBackData = await flipBackResponse.json();
        setGameState(prevState => ({ ...prevState, ...flipBackData }));
      }, 1000);
    }
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <h1>こーすけ神経衰弱</h1>
      {!gameState.gameStarted ? (
        <button onClick={startGame}>ゲーム開始</button>
      ) : (
        <>
          <div className={styles.gameBoard}>
            {gameState.cards.map((card) => (
              <div
                key={card.id}
                className={`${styles.card} ${card.isFlipped ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
                onClick={() => !card.isMatched && handleCardClick(card.id)}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>
                    <img src={CARD_BACK_IMAGE} alt="Card back" />
                  </div>
                  <div className={styles.cardBack}>
                    {!card.isMatched && <img src={card.imageUrl} alt={`Card ${card.id}`} />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p>マッチした組数: {gameState.matchedPairs}</p>
          <p>手数: {gameState.moves}</p>
          {gameState.gameEnded && <p>ゲームクリア！おめでとうございます！</p>}
        </>
      )}
    </main>
  );
}