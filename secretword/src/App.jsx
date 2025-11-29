import { use, useCallback, useEffect, useState } from 'react'
import './App.css'
import StartScreen from './componensts/StartScreen'
import Game from './componensts/Game'
import GameOver from './componensts/GameOver'
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

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    // Escolhe uma categoria aleatória
    const categories = Object.keys(words);
    const category = 
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Escolhe uma palavra aleatória da categoria escolhida
    const word = 
      words[category][Math.floor(Math.random() * words[category].length)];

    // console.log(category);  
    // console.log(word);
    return { word, category };
  }, [words]);

  // Inicia palavra secreta do jogo
  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickedWordAndCategory();
    
    // Cria um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Atualiza os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    
    setGameStage(stages[1].name);
  }, [pickedWordAndCategory]);

  // Processa a entrada das letras
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Checa se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Adiciona a letra nas letras corretas ou erradas
    if (letters.includes(normalizedLetter)) {
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

  // Checa condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Condição de vitória
    if (guessedLetters.length === uniqueLetters.length && gameStage === 'game') {
      // Adiciona pontos
      setScore((actualScore) => actualScore += 100);

      // Reinicia o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    
    // Verifica se todas as letras foram adivinhadas
    if (guessedLetters.length === uniqueLetters.length && gameStage === 'game') {
      // Adiciona pontos
      setScore((actualScore) => actualScore += 100);
      // Reinicia o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

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
