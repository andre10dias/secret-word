import './Game.css'

const Game = ({ verifyLetter }) => {
  return (
    <div>
      <h1>Game</h1>
      <button onClick={verifyLetter}>Game Over</button>
    </div>
  )
}

export default Game