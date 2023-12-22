import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useWindowSize } from "usehooks-ts"
import ReactConfetti from "react-confetti"
import he from "he"
import Loader from "../Loader"
import styles from "./style.module.scss"
import { resetStep } from "../../features/gameSlice"

interface Props {
  DEFAULT_TIMER: number
  restartGame: () => void
}

const GameRecap = ({ DEFAULT_TIMER, restartGame }: Props) => {
  const {
    currentGame,
    currentCategory,
    loadingCustomGame,
    loadingQuickGame,
    nRightAnswers,
    nWrongAnswers,
    timer,
    timerSeconds,
    gameRecapAnswers,
  } = useSelector((state: RootState) => state.game)
  const { width, height } = useWindowSize()
  const dispatch = useDispatch()

  useEffect(() => {
    localStorage.setItem(
      "correctAnswers",
      JSON.stringify(
        Number(localStorage.getItem("correctAnswers") || 0) + nRightAnswers
      )
    )
    localStorage.setItem(
      "wrongAnswers",
      JSON.stringify(
        Number(localStorage.getItem("wrongAnswers") || 0) + nWrongAnswers
      )
    )
    // eslint-disable-next-line
  }, [])

  return (
    <main className={styles.gameRecap}>
      <h1>
        You answered {nRightAnswers}/{currentGame.length} questions correctly
      </h1>
      {!nWrongAnswers &&
        nRightAnswers === currentGame.length &&
        nRightAnswers > 0 && (
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
        {loadingCustomGame === "pending" || loadingQuickGame === "pending" ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <button
            onClick={() => {
              restartGame()
            }}
          >
            Restart Game with the Same Settings
          </button>
        )}
        <button onClick={() => dispatch(resetStep())}>
          Back to Categories
        </button>
      </div>
      <h2>Answers:</h2>
      <section className={styles.gameRecapAnswersBox}>
        {gameRecapAnswers.map((answer) => {
          return (
            <article className={styles.answer} key={answer.question}>
              <div className={styles.categoryContainer}>
                <p>
                  {he.decode(
                    /:/.test(answer.category)
                      ? answer.category.slice(answer.category.indexOf(":") + 2)
                      : answer.category
                  )}
                </p>
              </div>
              <div className={styles.border}></div>
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
                <div className={styles.cardRecapFooter}>
                  <div className={styles.border}></div>
                  <div>
                    <div
                      className={styles.difficultySecondsContainer}
                      style={{
                        justifyContent:
                          timer === "on" || !currentCategory.name
                            ? "space-between"
                            : "center",
                      }}
                    >
                      <p>
                        {answer.difficulty[0].toUpperCase() +
                          answer.difficulty.slice(1)}
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
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default GameRecap
