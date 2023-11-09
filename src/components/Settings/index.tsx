import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'
import { setDifficulty, setQuestions, startGame } from '../../features/gameSlice'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [nQuestions, setNQuestions] = useState<string | number>(10)
  const numberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9e+-]/g, "")
    if (e.target.value === "" || Number(e.target.value) > 0 && Number(e.target.value) < 51) {
      setNQuestions(cleanedValue)
      dispatch(setQuestions(cleanedValue || 10))
    } 

  }
  return (
    <div>
      <h1>Settings</h1>
      <label>Difficulty</label>
      <select onChange={(e) => dispatch(setDifficulty(e.target.value))}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <label>Number of questions (1-50)</label>
      <input onChange={numberHandler} type='number' min='1' max='50' value={nQuestions} onKeyDown={ (e) => ['e', 'E', '+', '-', '.', ','].includes(e.key) && e.preventDefault() }/>
      <label>Type</label>
      <select onChange={(e) => dispatch(setDifficulty(e.target.value))}>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True or False</option>
      </select>
      <button onClick={() => dispatch(startGame())}>Start Game!</button>
      </div>
  )
}

export default Settings