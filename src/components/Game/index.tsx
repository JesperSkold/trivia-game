import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  fetchCusomGame,
  resetGame,
  emptyCurrentGame,
  fetchQuickGame,
} from "../../features/gameSlice"
import he from "he"
import BackBtn from "../BackBtn"
import styles from "./style.module.scss"
import Loader from "../Loader"

const Game = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentGame,
    currentCategory,
    difficulty,
    questions,
    type,
    loadingCustomGame,
    loadingQuickGame,
  } = useSelector((state: RootState) => state.game)
  //rename these states
  const [score, setScore] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [nWrongAnswers, setNWrongAnswers] = useState<number>(0)
  const [answer, setAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<any>([])
  const [timesUp, setTimesup] = useState<boolean>(false)
  const [timer, setTimer] = useState<number>(30)
  const [endGameStats, setEndGameStats] = useState<any>([])

  useEffect(() => {
    if (timesUp) {
      setNWrongAnswers((prev) => prev + 1)
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval)
          setTimesup(true)
          return 0
        } else {
          if (answer) {
            clearInterval(interval)
            return prevTimer
          } else {
            return prevTimer - 1
          }
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [answer, timesUp])

  useEffect(() => {
    if (!currentGame?.length) {
      dispatch(fetchCusomGame({ currentCategory, difficulty, questions, type }))
    }
  }, [dispatch])

  useEffect(() => {
    if (currentGame?.length > 0 && currentGame?.length !== count) {
      const mergedArr = [
        ...currentGame[count]?.incorrect_answers,
        currentGame[count]?.correct_answer,
      ]
      if (mergedArr.find((elem) => elem === "True")) {
        setAnswers(mergedArr.sort().reverse())
      } else {
        setAnswers(mergedArr.sort((a, b) => 0.5 - Math.random()))
      }
    }
  }, [currentGame, count])

  const handleAnswer = (option: string) => {
    setAnswer(option)
    if (option === currentGame[count]?.correct_answer) {
      setScore((prev) => prev + 1)
    } else {
      setNWrongAnswers((prev) => prev + 1)
    }
    setEndGameStats((prev: any) => [
      ...prev,
      { ...currentGame[count], chosenAnswer: option },
    ])
  }

  const restartGame = () => {
    dispatch(emptyCurrentGame()) //prevents old question from flickering into view when restarting
    currentCategory?.name
      ? dispatch(
          fetchCusomGame({ currentCategory, difficulty, questions, type })
        )
      : dispatch(fetchQuickGame())
    setCount(0)
    setScore(0)
    setNWrongAnswers(0)
    setAnswer("")
  }

  return (
    <div>
      {(loadingCustomGame === "pending" || loadingQuickGame === "pending") && (
        <Loader />
      )}
      {currentGame?.length > 0 && currentGame?.length !== count && (
        <div className={styles.gameContainer}>
          <div className={styles.header}>
            <BackBtn />
            <h2 className={styles.categoryName}>
              {he.decode(currentGame[count]?.category)}
            </h2>
            <h2>
              {count + 1}/{currentGame.length}
            </h2>
          </div>
          <div className={styles.border}></div>
          <div className={styles.questionContainer}>
            <div className={styles.question}>
              <h1>{he.decode(currentGame[count]?.question)}</h1>
            </div>
            <div className={styles.answers}>
              {answers?.length > 0 &&
                answers.map((option: string) => (
                  <button
                    key={option}
                    onClick={() => {
                      handleAnswer(option)
                    }}
                    disabled={!!answer || timesUp}
                    className={`
                ${
                  answer === option &&
                  option !== currentGame[count]?.correct_answer &&
                  styles.chosenWrongAnswer
                }
                  ${
                    (answer || timesUp) &&
                    option === currentGame[count]?.correct_answer
                      ? styles.correctAnswer
                      : (answer || timesUp) &&
                        option !== currentGame[count]?.correct_answer &&
                        styles.wrongAnswer
                  }`}
                  >
                    {he.decode(option)}
                  </button>
                ))}
            </div>
            {!answer && !timesUp && (
              <div className={styles.nextBtnPlaceholder}></div>
            )}
            {(answer || timesUp) && (
              <button
                className={styles.nextBtn}
                onClick={() => {
                  setCount((prev) => prev + 1)
                  if (currentGame.length - 1 !== count) {
                    setAnswer("")
                    setTimesup(false)
                  }
                  setTimer(30)
                }}
              >
                {currentGame.length - 1 === count
                  ? "Finish Game"
                  : "Next Question"}
              </button>
            )}
          </div>
          <section className={styles.answersMeta}>
            <div className={styles.border}></div>
            <div className={styles.correctAnswerNDifficultyBox}>
              <h2>
                Correct Answer{score !== 1 && "s"}: {score}
              </h2>
              <h2>
                Difficulty:{" "}
                {currentGame[count]?.difficulty[0].toUpperCase() +
                  currentGame[count]?.difficulty.slice(1)}
              </h2>
            </div>
            <div className={styles.wrongAnswerNTimeBox}>
              <h2>
                Wrong Answer{nWrongAnswers !== 1 && "s"}: {nWrongAnswers}
              </h2>
              <h2
                className={`${styles.counter} ${
                  timer <= 15 && timer > 0
                    ? styles.timesAlmostUp
                    : timer <= 0 && styles.timesUp
                }`}
              >
                {timer ? `Time Left: ${timer}` : "Time's up!"}
              </h2>
            </div>
          </section>
        </div>
      )}
      {currentGame?.length === count && count !== 0 && (
        <div className={styles.endGame}>
          <h1>
            You answered {score}/{currentGame.length} questions correctly
          </h1>
          {!nWrongAnswers && <h1>Congratulations!</h1>}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                setTimesup(false)
                setAnswer("")
                restartGame()
                setEndGameStats([])
              }}
            >
              Restart Game with the Same Settings
            </button>
            <button onClick={() => dispatch(resetGame())}>
              Change Category and Settings
            </button>
          </div>
          <h2>Answers:</h2>
          <div className={styles.endGameAnswersBox}>
            {endGameStats.map((answer: any) => {
              return (
                <div className={styles.endGameAnswer} key={answer.question}>
                  <p>{he.decode(answer.question)}</p>
                  <div>
                    <p
                      className={
                        answer.correct_answer === answer.chosenAnswer
                          ? styles.correctAnswer
                          : styles.wrongAnswer
                      }
                    >
                      Your Answer: {he.decode(answer.chosenAnswer)}
                    </p>
                    {answer.correct_answer !== answer.chosenAnswer && (
                      <p>Correct Answer: {he.decode(answer.correct_answer)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Game
