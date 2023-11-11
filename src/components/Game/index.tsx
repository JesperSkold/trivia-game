import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store"
import { fetchGame, resetGame, emptyCurrentGame } from "../../features/gameSlice"
import he from "he"
import BackBtn from "../BackBtn"
import styles from "./style.module.scss"

const Game = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    currentGame,
    currentCategory,
    difficulty,
    questions,
    type,
    loadingQuestions,
  } = useSelector((state: RootState) => state.game)
  // const [question, setQuestion] = useState<{
  //   question: string | undefined
  //   correct_answer: string | undefined
  // }>({ question: undefined, correct_answer: undefined })
  const [score, setScore] = useState<number>(0)
  const [count, setCount] = useState<number>(0)
  const [nWrongAnswers, setNWrongAnswers] = useState<number>(0)
  const [answer, setAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<any>([])
  // const [gameWon, setGameWon] = useState<boolean>(false)
  // const [gameOver, setGameOver] = useState<boolean>(false) //could eventually add this to gameSlice and let user pick for themselves

  useEffect(() => {
    dispatch(fetchGame({ currentCategory, difficulty, questions, type }))
  }, [dispatch])

  useEffect(() => {
    if (currentGame.length > 0 && currentGame.length !== count) {
      setAnswers(
        [
          ...currentGame[count]?.incorrect_answers,
          currentGame[count]?.correct_answer,
        ].sort((a, b) => 0.5 - Math.random())
      )
    }
    // if (currentGame.length === score) {
    //   setGameWon(true)
    // }
  }, [currentGame, count])

  const handleAnswer = (option: string) => {
    setAnswer(option)
    if (option === currentGame[count]?.correct_answer) {
      setScore((prev) => prev + 1)
    } else {
      setNWrongAnswers((prev) => prev + 1)
    }
  }

  const restartGame = () => {
    dispatch(emptyCurrentGame()) //prevents old question from flickering into view when restarting
    dispatch(fetchGame({ currentCategory, difficulty, questions, type }))
    setCount(0)
    //save Score and wronganswersscore in lastGameStats
    setScore(0)
    setNWrongAnswers(0)
    setAnswer('')
  }

  console.log(currentGame, "currentgame")

  return (
    <>
      <BackBtn />
      {currentGame.length > 0 && currentGame.length !== count && (
        <div>
          <h1>{he.decode(currentGame[count]?.question)}</h1>
          <h1>{currentGame[count]?.correct_answer}</h1>
          <h1>Score: {score}</h1>
          {nWrongAnswers > 0 && (
            <h2>
              You have {nWrongAnswers} wrong answer{nWrongAnswers > 1 && "s"}
            </h2>
          )}
          {answers.length > 0 &&
            answers.map((option: string) => (
              <button
                key={option}
                onClick={() => {
                  handleAnswer(option)
                }}
                disabled={!!answer}
                className={`
                ${answer === option && styles.chosenAnswer}
                  ${
                    answer && option === currentGame[count]?.correct_answer
                      ? styles.correctAnswer
                      : answer &&
                        option !== currentGame[count]?.correct_answer &&
                        styles.wrongAnswer
                  }`}
              >
                {he.decode(option)}
              </button>
            ))}
          {answer && (
            <button
              onClick={() => {
                setCount((prev) => prev + 1)
                setAnswer("")
              }}
            >
              {currentGame.length - 1 === count
                ? "Finish Game"
                : "Next Question"}
            </button>
          )}
        </div>
      )}
      {currentGame.length === count && count !== 0 && (
          <div>
            <div>
              <h1>
                You answered {score}/{currentGame.length} questions correctly
              </h1>
              {!nWrongAnswers && <h1>Congratulations!!!</h1>}
            </div>
            <button onClick={() => restartGame()}>Restart Game with the Same Settings</button>
            <button onClick={() => dispatch(resetGame())}>Change Category and Settings</button>
          </div>
      )}
    </>
  )
}

export default Game
