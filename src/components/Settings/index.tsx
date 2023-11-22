import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  setDifficulty,
  setType,
  setNQuestions,
  setTimerSeconds,
  setTimer,
  fetchCustomGame,
} from "../../features/gameSlice"
import BackBtn from "../BackBtn"
import Loader from "../Loader"
import styles from "./style.module.scss"

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentCategory,
    difficulty,
    nQuestions,
    type,
    timer,
    timerSeconds,
    loadingCustomGame,
  } = useSelector((state: RootState) => state.game)
  const [inputNQuestions, setInputNQuestions] = useState<string>(nQuestions)
  const [inputTimerSeconds, setInputTimerSeconds] =
    useState<string>(timerSeconds)

  const numberHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const cleanedValue = e.target.value.replace(/[^0-9e+-]/g, "")
    if (field === "nQuestionField") {
      if (
        e.target.value === "" ||
        (Number(e.target.value) >= 1 && Number(e.target.value) <= 50)
      ) {
        setInputNQuestions(cleanedValue)
        dispatch(setNQuestions(cleanedValue || 5))
      }
    } else if (field === "timerField") {
      if (
        e.target.value === "" ||
        (Number(e.target.value) >= 1 && Number(e.target.value) <= 60)
      ) {
        setInputTimerSeconds(cleanedValue)
        dispatch(setTimerSeconds(cleanedValue || 30))
      }
    }
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.titleContainer}>
        <BackBtn />
        <h1>Settings</h1>
        <div></div>
      </div>
      <div>
        <label>Number of questions (1-50)</label>
        <input
          onChange={(e) => numberHandler(e, "nQuestionField")}
          type="number"
          min="1"
          max="50"
          value={inputNQuestions}
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
          <option value="random">Random</option>
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
          <option value="random">Random</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True or False</option>
        </select>
      </div>
      <div>
        <label>Question Timer</label>
        <select
          onChange={(e) => dispatch(setTimer(e.target.value))}
          defaultValue={timer}
        >
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>
      {timer === "on" && (
        <div>
          <label>Seconds to Answer</label>
          <input
            onChange={(e) => numberHandler(e, "timerField")}
            type="number"
            min="1"
            max="60"
            value={inputTimerSeconds}
            onKeyDown={(e) =>
              ["e", "E", "+", "-", ".", ","].includes(e.key) &&
              e.preventDefault()
            }
          />
        </div>
      )}
      {loadingCustomGame === "pending" ? (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      ) : (
        <button
          onClick={() =>
            dispatch(
              fetchCustomGame({ currentCategory, difficulty, nQuestions, type })
            )
          }
        >
          Start Game!
        </button>
      )}
    </div>
  )
}

export default Settings
