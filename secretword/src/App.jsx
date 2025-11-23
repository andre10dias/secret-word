import { useState } from 'react'
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

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = () => {
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
  }

  // Inicia palavra secreta do jogo
  const startGame = () => {
    const { word, category } = pickedWordAndCategory();
    
    // Cria um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Atualiza os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);
    
    setGameStage(stages[1].name);
  }

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

  // Recomeça o jogo
  const retry = () => {
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
      {gameStage === 'end' && <GameOver retry={retry} />}
    </div>
  )
}

export default App
