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
import BackBtn from "../BackBtn"
import Loader from "../Loader"
import ReactConfetti from "react-confetti"
import he from "he"
import { IGame } from "../../interface/game"
import styles from "./style.module.scss"

const DEFAULT_TIMER = 30

const Game = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentGame,
    currentCategory,
    difficulty,
    nQuestions,
    type,
    loadingCustomGame,
    loadingQuickGame,
    timer,
    timerSeconds,
  } = useSelector((state: RootState) => state.game)
  const [nRightAnswers, setNRightAnswers] = useState<number>(0)
  const [nWrongAnswers, setNWrongAnswers] = useState<number>(0)
  const [questionIndex, setQuestionIndex] = useState<number>(0)
  const [countDown, setCountDown] = useState<number>(
    currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER
  )
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [allAnswers, setAllAnswers] = useState<string[]>([])
  const [timesUp, setTimesUp] = useState<boolean>(false)
  const [endGameStats, setEndGameStats] = useState<IGame[]>([])
  const { width, height } = useWindowSize()

  useEffect(() => {
    if ((timer === "on" || !currentCategory.name) && !timesUp && !userAnswer) {
      const interval = setInterval(() => {
        setCountDown((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval)
            setTimesUp(true)
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
    if (timesUp) {
      setNWrongAnswers((prev) => prev + 1)

      setEndGameStats((prev) => [
        ...prev,
        {
          ...currentGame[questionIndex],
          timeSpent:
            (currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER) -
            countDown,
        },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesUp])

  useEffect(() => {
    if (!currentGame?.length) {
      dispatch(
        fetchCustomGame({ currentCategory, difficulty, nQuestions, type })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {
        ...currentGame[questionIndex],
        chosenAnswer: option,
        timeSpent:
          (currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER) -
          countDown,
      },
    ])
  }

  const restartGame = () => {
    dispatch(emptyCurrentGame())
    currentCategory?.name
      ? dispatch(
          fetchCustomGame({ currentCategory, difficulty, nQuestions, type })
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
                  setCountDown(
                    currentCategory.name ? Number(timerSeconds) : DEFAULT_TIMER
                  )
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
          </section>
        </div>
      )}
      {currentGame?.length === questionIndex && questionIndex !== 0 && (
        <div className={styles.endGame}>
          <h1>
            You answered {nRightAnswers}/{currentGame.length} questions
            correctly
          </h1>
          {!nWrongAnswers && nRightAnswers === currentGame.length && (
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
                    {answer.chosenAnswer ? (
                      <p
                        className={
                          answer.correct_answer === answer.chosenAnswer
                            ? styles.correctAnswer
                            : styles.wrongAnswer
                        }
                      >
                        Your Answer: {he.decode(answer.chosenAnswer)}
                      </p>
                    ) : (
                      <p className={styles.wrongAnswer}>Time Ran Out!</p>
                    )}
                    {answer.correct_answer !== answer.chosenAnswer && (
                      <p>Correct Answer: {he.decode(answer.correct_answer)}</p>
                    )}
                    <div className={styles.categoryNTimeBox}>
                      <p>
                        {he.decode(
                          /:/.test(answer.category)
                            ? answer.category.slice(
                                answer.category.indexOf(":") + 2
                              )
                            : answer.category
                        )}
                      </p>
                      {(timer === "on" || !currentCategory.name) && (
                        <p>
                          {answer.timeSpent}/
                          {currentCategory.name
                            ? Number(timerSeconds)
                            : DEFAULT_TIMER}{" "}
                          Seconds Passed
                        </p>
                      )}
                    </div>
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
