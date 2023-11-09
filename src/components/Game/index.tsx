import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'
import { fetchGame } from '../../features/gameSlice'

const Game = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentGame
  } = useSelector((state: RootState) => state.game)

  const {
    currentCategory,
    difficulty,
    questions,
    type
  } = useSelector((state: RootState) => state.game)
  useEffect(() => {
    dispatch(fetchGame({currentCategory, difficulty, questions, type}))
  }, [dispatch])
  console.log(currentGame, "currentgame");
  
  return (
    <div>
      {currentGame[0]?.question}
      </div>
  )
}

export default Game
