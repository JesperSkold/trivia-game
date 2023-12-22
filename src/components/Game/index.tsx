import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  fetchCustomGame,
  fetchQuickGame,
  setShowRecap,
  addToGameRecapAnswers,
  setTimesUp,
  setNRightAnswers,
  setNWrongAnswers,
} from "../../features/gameSlice"
import BackBtn from "../BackBtn"
import GameRecap from "../GameRecap"
import he from "he"
import styles from "./style.module.scss"

const DEFAULT_TIMER = 30

const Game = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentGame,
    currentCategory,
    showRecap,
    difficulty,
    nQuestions,
    gameRecapAnswers,
    nRightAnswers,
    nWrongAnswers,
    type,
    timer,
    timesUp,
    timerSeconds,
  } = useSelector((state: RootState) => state.game)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(
    currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER
  )
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [allAnswers, setAllAnswers] = useState<string[]>([])

  useEffect(() => {
    if ((timer === "on" || !currentCategory.name) && !timesUp && !userAnswer) {
      const interval = setInterval(() => {
        setCountDown((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval)
            return 0
          } else {
            return prevTimer - 1
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, timesUp])

  useEffect(() => {
    if (countDown === 0 && !timesUp) {
      dispatch(setTimesUp(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countDown])

  useEffect(() => {
    if (timesUp && gameRecapAnswers.length !== currentGame.length) {
      dispatch(setNWrongAnswers())
      dispatch(
        addToGameRecapAnswers({
          gameMeta: currentGame[questionIndex],
          timeSpent:
            (currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER) -
            countDown,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesUp])

  useEffect(() => {
    if (currentGame?.length > 0 && currentGame?.length !== questionIndex) {
      const mergedArr = [
        ...currentGame[questionIndex]?.incorrect_answers,
        currentGame[questionIndex]?.correct_answer,
      ]

      if (mergedArr.find((elem) => elem === "True")) {
        setAllAnswers(mergedArr.sort().reverse())
      } else {
        setAllAnswers(mergedArr.sort((a, b) => 0.5 - Math.random()))
      }
    }
  }, [currentGame, questionIndex])

  const handleAnswer = (option: string) => {
    setUserAnswer(option)

    if (option === currentGame[questionIndex]?.correct_answer) {
      dispatch(setNRightAnswers())
    } else {
      dispatch(setNWrongAnswers())
    }

    dispatch(
      addToGameRecapAnswers({
        gameMeta: currentGame[questionIndex],
        chosenAnswer: option,
        timeSpent:
          (currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER) -
          countDown,
      })
    )
  }

  const restartGame = () => {
    currentCategory.name
      ? dispatch(
          fetchCustomGame({ currentCategory, difficulty, nQuestions, type })
        )
      : dispatch(fetchQuickGame())
    setQuestionIndex(0)
    setUserAnswer("")
  }

  return (
    <>
      <div>
        {!showRecap && currentGame.length > 0 && (
          <div className={styles.gameContainer}>
            <header className={styles.header}>
              <BackBtn />
              <h2 className={styles.categoryName}>
                {he.decode(
                  /:/.test(currentGame[questionIndex]?.category)
                    ? currentGame[questionIndex]?.category.slice(
                        currentGame[questionIndex]?.category.indexOf(":") + 2
                      )
                    : currentGame[questionIndex]?.category
                )}
              </h2>
              <h2>
                {questionIndex + 1}/{currentGame.length}
              </h2>
            </header>
            <div className={styles.border}></div>
            <main className={styles.questionContainer}>
              <div className={styles.question}>
                <h1>{he.decode(currentGame[questionIndex]?.question)}</h1>
              </div>
              <div className={styles.answers}>
                {allAnswers?.length > 0 &&
                  allAnswers.map((option: string) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleAnswer(option)
                      }}
                      disabled={!!userAnswer || timesUp}
                      className={`
                ${
                  userAnswer === option &&
                  option !== currentGame[questionIndex]?.correct_answer &&
                  styles.chosenWrongAnswer
                }
                  ${
                    (userAnswer || timesUp) &&
                    option === currentGame[questionIndex]?.correct_answer
                      ? styles.correctAnswer
                      : (userAnswer || timesUp) &&
                        option !== currentGame[questionIndex]?.correct_answer &&
                        styles.wrongAnswer
                  }`}
                    >
                      {he.decode(option)}
                    </button>
                  ))}
              </div>
              {!userAnswer && !timesUp && (
                <div className={styles.nextBtnPlaceholder}></div>
              )}
              {(userAnswer || timesUp) && (
                <button
                  className={styles.nextBtn}
                  onClick={() => {
                    setQuestionIndex((prev) => prev + 1)
                    if (currentGame.length - 1 !== questionIndex) {
                      setUserAnswer("")
                      dispatch(setTimesUp(false))
                    } else {
                      dispatch(setTimesUp(true))
                      dispatch(setShowRecap(true))
                    }
                    setCountDown(
                      currentCategory.name
                        ? Number(timerSeconds)
                        : DEFAULT_TIMER
                    )
                  }}
                >
                  {currentGame.length - 1 === questionIndex
                    ? "Finish Game"
                    : "Next Question"}
                </button>
              )}
            </main>
            <footer className={styles.answersMeta}>
              <div className={styles.border}></div>
              <div className={styles.wrongAnswerNTimeBox}>
                <h2>Correct Answers: {nRightAnswers}</h2>

                {(timer === "on" || !currentCategory.name) && (
                  <h2
                    className={`${styles.counter} ${
                      countDown >= 1 &&
                      countDown <=
                        (currentCategory.name
                          ? Math.floor(Number(timerSeconds) / 2)
                          : DEFAULT_TIMER / 2)
                        ? styles.timesAlmostUp
                        : countDown <= 0 && styles.timesUp
                    }`}
                  >
                    {countDown ? `Time Left: ${countDown}` : "Time's up!"}
                  </h2>
                )}
              </div>
              <div className={styles.correctAnswerNDifficultyBox}>
                <h2>Wrong Answers: {nWrongAnswers}</h2>
                <h2>
                  Difficulty:{" "}
                  {currentGame[questionIndex]?.difficulty[0].toUpperCase() +
                    currentGame[questionIndex]?.difficulty.slice(1)}
                </h2>
              </div>
            </footer>
          </div>
        )}
      </div>
      {showRecap && (
        <GameRecap
          restartGame={restartGame}
          DEFAULT_TIMER={DEFAULT_TIMER}
        />
      )}
    </>
  )
}

export default Game
