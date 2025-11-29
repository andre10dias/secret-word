import { useCallback, useEffect, useState } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'
import { wordsList } from './data/words'

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' }
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [normalizedLetters, setNormalizedLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);
  const [revealWord, setRevealWord] = useState(false);

  const pickedWordAndCategory = useCallback(() => {
    // Escolhe uma categoria aleatória
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * categories.length)];

    // Escolhe uma palavra aleatória da categoria escolhida
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // Inicia palavra secreta do jogo
  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickedWordAndCategory();
    
    // Cria um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Letras normalizadas (remove acentos/diacríticos) usadas na validação de input
    // Mantemos letras normalizadas apenas para letras/números, filtrando hífens/espaços
    const wordNormalized = wordLetters.map((l) => l.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      ).filter((l) => /^[a-z0-9]$/i.test(l));

    // Atualiza os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    setNormalizedLetters(wordNormalized);
    
    setGameStage(stages[1].name);
  }, [pickedWordAndCategory]);

  // Processa a entrada das letras
  const verifyLetter = (letter) => {
    // Se a palavra está sendo exibida (modo vitória), ignorar entradas
    if (revealWord) return;
    const normalizedLetter = letter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Checa se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Adiciona a letra nas letras corretas ou erradas
    if (normalizedLetters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // Checa se o jogo acabou
  useEffect(() => {
    if (guesses <= 0) {
      // Reinicia todos os estados
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Checa condição de vitória (usa letras normalizadas para permitir acentuação opcional)
  useEffect(() => {
    const uniqueLetters = [...new Set(normalizedLetters)];

    // Condição de vitória
    if (guessedLetters.length === uniqueLetters.length && gameStage === 'game' && !revealWord) {
      // Adiciona pontos
      setScore((actualScore) => actualScore + 100);

      // Mostra a palavra (modo revelação) e aguarda ação do usuário para próxima palavra
      setRevealWord(true);
    }
  }, [guessedLetters, normalizedLetters, gameStage, revealWord]);

  // Avança para a próxima palavra quando o usuário clicar
  const nextWord = useCallback(() => {
    setRevealWord(false);
    startGame();
  }, [startGame]);

  // Recomeça o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    clearLetterStates();
    setGameStage(stages[0].name);
  }
  
  return (
    <div className="app">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters} 
          wrongLetters={wrongLetters} 
          guesses={guesses} 
          score={score} 
          revealWord={revealWord}
          onNext={nextWord}
        />
      )}
      {gameStage === 'end' && 
        <GameOver 
          retry={retry} 
          score={score} 
        />
      }
    </div>
  )
}

export default App
