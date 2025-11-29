import './GameOver.css'

const GameOver = ({ retry, score }) => {
  return (
    <div>
      <h1>Fim do jogo!</h1>
      <h2>Pontuação: <span>{score}</span></h2>
      <button onClick={retry}>Recomeçar</button>
    </div>
  )
}

export default GameOver