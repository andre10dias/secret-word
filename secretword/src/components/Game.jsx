import { useState, useRef, useEffect } from 'react'
import './Game.css'

const Game = ({ 
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
  revealWord = false,
  onNext = () => {},
}) => {
  const [letter, setLetter] = useState("");
  const letterInputRef = useRef(null);
  const nextButtonRef = useRef(null);

  const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    setLetter("");
    letterInputRef.current.focus();
  };

  // Foca o input quando uma nova palavra inicia; foca o botão Próxima quando estiver no modo revelação
  useEffect(() => {
    if (revealWord) {
      if (nextButtonRef.current) nextButtonRef.current.focus();
    } else if (letterInputRef.current) {
      letterInputRef.current.focus();
    }
  }, [letters, revealWord]);

  return (
    <div className="game">
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>
      <h1>Adivinhe a palavra:</h1>
      <h3 className="tip">
        Dica sobre a palavra: <span>{pickedCategory}</span>
      </h3>
      <p>Você ainda tem {guesses} tentativa(s).</p>
      <div className="wordContainer">
        {
          letters.map((char, i) => {
            const normalized = normalize(char);
            const isAlphaNumeric = /^[a-z0-9]$/i.test(normalized);
            const isSeparator = !isAlphaNumeric;
            if (isSeparator) {
              // Exibe separadores (hífen/espaço/pontuação) usando o mesmo estilo das letras
              if (char === ' ') {
                return (
                  <span key={i} className="letter" aria-label="space">&nbsp;</span>
                )
              }
              return (
                <span key={i} className="letter">{char}</span>
              )
            }

            return (guessedLetters.includes(normalized) || revealWord) ? (
              <span key={i} className="letter">{char}</span>
            ) : (
              <span key={i} className="blankSquare"></span>
            )
          })
        }
      </div>
      <div className="letterContainer">
        <p>Tente adivinhar uma letra da palavra:</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="letter"
            maxLength="1" 
            required 
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
            disabled={revealWord}
          />
          <button disabled={revealWord}>Jogar!</button>
        </form>
      </div>
      {revealWord && (
        <div className="revealContainer">
          <div className="successMessage">🎉 Parabéns! Você acertou a palavra!</div>
          <div className="revealNotice">A palavra era: <strong>{pickedWord}</strong></div>
          <div className="nextButtonContainer">
            <button type="button" ref={nextButtonRef} className="nextButton" onClick={onNext}>Próxima palavra</button>
          </div>
        </div>
      )}
      <div className="wrongLettersContainer">
        <p>Letras já utilizadas:</p>
        <div className="wrongLettersList">
        {
          wrongLetters.map((wrongLetter, i) => (
            <span key={i}>{wrongLetter}</span>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Game
