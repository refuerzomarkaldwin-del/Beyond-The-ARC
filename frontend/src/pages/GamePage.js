import React, { useState, useEffect } from 'react';

const ICONS = ['🟠', '🏀', '⭐', '🔥', '💥', '🎯', '⚡', '🌟'];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = () => {
  const doubled = [...ICONS, ...ICONS];
  const shuffled = shuffleArray(doubled);
  return shuffled.map((icon, idx) => ({
    id: idx,
    icon,
    matched: false,
    flipped: false
  }));
};

const GamePage = () => {
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [lockBoard, setLockBoard] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      if (firstCard.icon === secondCard.icon) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, matched: true }
              : card
          )
        );
        setMatches(prev => prev + 1);
        setFirstCard(null);
        setSecondCard(null);
        setLockBoard(false);
        
        if (matches + 1 === 8) {
          setStatusMessage('🎉 You win! 🎉');
        }
      } else {
        setLockBoard(true);
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          setFirstCard(null);
          setSecondCard(null);
          setLockBoard(false);
        }, 800);
      }
    }
  }, [firstCard, secondCard, matches]);

  const initGame = () => {
    setCards(createCards());
    setFirstCard(null);
    setSecondCard(null);
    setLockBoard(false);
    setMoves(0);
    setMatches(0);
    setStatusMessage('');
  };

  const handleCardClick = (clickedCard) => {
    if (lockBoard) return;
    if (clickedCard.matched) return;
    if (clickedCard.flipped) return;
    if (firstCard && secondCard) return;

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === clickedCard.id ? { ...card, flipped: true } : card
      )
    );

    if (!firstCard) {
      setFirstCard(clickedCard);
    } else if (!secondCard && firstCard.id !== clickedCard.id) {
      setSecondCard(clickedCard);
      setMoves(prev => prev + 1);
    }
  };

  return (
    <main className="game-container">
      <h1 className="title">Memory Match</h1>
      <div className="game-info">
        <div className="small">Find all matching pairs</div>
        <div>
          <span className="small">Moves: </span>
          <span id="moves">{moves}</span>
          &nbsp;•&nbsp;
          <span className="small">Matches: </span>
          <span id="matches">{matches}</span>/8
        </div>
        <div className="small" id="status">{statusMessage}</div>
      </div>

      <div className="board">
        {cards.map(card => (
          <div
            key={card.id}
            className={`card ${card.flipped || card.matched ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            {card.flipped || card.matched ? card.icon : '?'}
          </div>
        ))}
      </div>

      <div className="controls">
        <button className="btn btn-color-1" onClick={initGame}>
          Restart
        </button>
      </div>
    </main>
  );
};

export default GamePage;