import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import {
  fetchCustomGame,
  resetGame,
  emptyCurrentGame,
  fetchQuickGame,
} from "../../features/gameSlice"
import { useWindowSize } from "usehooks-ts"
import he from "he"
import BackBtn from "../BackBtn"
import styles from "./style.module.scss"
import Loader from "../Loader"
import ReactConfetti from "react-confetti"
import { IGame } from "../../interface/game"

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
  const [nRightAnswers, setNRightAnswers] = useState<number>(0)
  const [nWrongAnswers, setNWrongAnswers] = useState<number>(0)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [timer, setTimer] = useState<number>(30)
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [allAnswers, setAllAnswers] = useState<string[]>([])
  const [timesUp, setTimesUp] = useState<boolean>(false)
  const [endGameStats, setEndGameStats] = useState<IGame[]>([])
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (timesUp) {
      setNWrongAnswers((prev) => prev + 1)
    }
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval)
          setTimesUp(true)
          return 0
        } else {
          if (userAnswer) {
            clearInterval(interval)
            return prevTimer
          } else {
            return prevTimer - 1
          }
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [userAnswer, timesUp])

  useEffect(() => {
    if (!currentGame?.length) {
      dispatch(
        fetchCustomGame({ currentCategory, difficulty, questions, type })
      )
    }
  }, [dispatch])

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
      setNRightAnswers((prev) => prev + 1)
    } else {
      setNWrongAnswers((prev) => prev + 1)
    }
    setEndGameStats((prev) => [
      ...prev,
      { ...currentGame[questionIndex], chosenAnswer: option },
    ])
  }

  const restartGame = () => {
    dispatch(emptyCurrentGame()) //prevents old question from flickering into view when restarting
    currentCategory?.name
      ? dispatch(
          fetchCustomGame({ currentCategory, difficulty, questions, type })
        )
      : dispatch(fetchQuickGame())
    setQuestionIndex(0)
    setNRightAnswers(0)
    setNWrongAnswers(0)
    setUserAnswer("")
  }

  return (
    <div>
      {(loadingCustomGame === "pending" || loadingQuickGame === "pending") && (
        <Loader />
      )}
      {currentGame?.length > 0 && currentGame?.length !== questionIndex && (
        <div className={styles.gameContainer}>
          <div className={styles.header}>
            <BackBtn />
            <h2 className={styles.categoryName}>
              {he.decode(currentGame[questionIndex]?.category)}
            </h2>
            <h2>
              {questionIndex + 1}/{currentGame.length}
            </h2>
          </div>
          <div className={styles.border}></div>
          <div className={styles.questionContainer}>
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
                    setTimesUp(false)
                  }
                  setTimer(30)
                }}
              >
                {currentGame.length - 1 === questionIndex
                  ? "Finish Game"
                  : "Next Question"}
              </button>
            )}
          </div>
          <section className={styles.answersMeta}>
            <div className={styles.border}></div>
            <div className={styles.correctAnswerNDifficultyBox}>
              <h2>
                Correct Answer{nRightAnswers !== 1 && "s"}: {nRightAnswers}
              </h2>
              <h2>
                Difficulty:{" "}
                {currentGame[questionIndex]?.difficulty[0].toUpperCase() +
                  currentGame[questionIndex]?.difficulty.slice(1)}
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
      {currentGame?.length === questionIndex && questionIndex !== 0 && (
        <div className={styles.endGame}>
          <h1>
            You answered {nRightAnswers}/{currentGame.length} questions
            correctly
          </h1>
          {!nWrongAnswers && (
            <>
              <ReactConfetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={400}
                colors={["#164863", "#427D9D", "#9BBEC8", "#DDF2FD"]}
              />
              <h1>Congratulations!</h1>
            </>
          )}
          <div className={styles.buttonContainer}>
            <button
              onClick={() => {
                setTimesUp(false)
                setUserAnswer("")
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
            {endGameStats.map((answer) => {
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
                      Your Answer: {he.decode(answer.chosenAnswer || "")}
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
