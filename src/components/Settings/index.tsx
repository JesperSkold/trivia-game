import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  setDifficulty,
  setType,
  setQuestions,
  startGame,
} from "../../features/gameSlice"
import BackBtn from "../BackBtn"
import styles from './style.module.scss'

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { difficulty, questions, type } = useSelector(
    (state: RootState) => state.game
  )
  const [nQuestions, setNQuestions] = useState<string | number>(questions)

  const numberHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9e+-]/g, "")
    if (
      e.target.value === "" ||
      (Number(e.target.value) > 0 && Number(e.target.value) < 51)
    ) {
      setNQuestions(cleanedValue)
      dispatch(setQuestions(cleanedValue || 10))
    }
  }
  return (
    <div className={styles.settingsContainer}>
      <BackBtn />
      <h1>Settings</h1>
      <div>
      <label>Number of questions (1-50)</label>
      <input
        onChange={numberHandler}
        type="number"
        min="1"
        max="50"
        value={nQuestions}
        onKeyDown={(e) =>
          ["e", "E", "+", "-", ".", ","].includes(e.key) && e.preventDefault()
        }
      />
      </div>
      <div>
      <label>Difficulty</label>
      <select
        onChange={(e) => dispatch(setDifficulty(e.target.value))}
        defaultValue={difficulty}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      </div>
      <div>
      <label>Type</label>
      <select
        onChange={(e) => dispatch(setType(e.target.value))}
        defaultValue={type}
      >
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True or False</option>
      </select>
      </div>
      <button onClick={() => dispatch(startGame())}>Start Game!</button>
    </div>
  )
}

export default Settings
