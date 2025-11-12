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

  // Inicia palavra secreta do jogo
  const startGame = () => {
    setGameStage(stages[1].name);
  }


  // Processa a entrada das letras
  const verifyLetter = () => {
    setGameStage(stages[2].name);
  }

  // Recomeça o jogo
  const retry = () => {
    setGameStage(stages[0].name);
  }
  
  return (
    <div className="app">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} />}
      {gameStage === 'end' && <GameOver retry={retry} />}
    </div>
  )
}

export default App
