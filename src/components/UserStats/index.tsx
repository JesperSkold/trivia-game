import React, { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"
import styles from "./style.module.scss"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { setShowStats } from "../../features/gameSlice"

const UserStats = () => {
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [correctAnswersPercentage, setCorrectAnswersPercentage] = useState("")
  const { showStats } = useSelector((state: RootState) => state.game)
  const dispatch = useDispatch()

  useEffect(() => {
    const storedCorrectAnswers = localStorage.getItem("correctAnswers")
    let parsedCorrectAnswers = 0

    if (storedCorrectAnswers) {
      parsedCorrectAnswers = JSON.parse(storedCorrectAnswers)
      setCorrectAnswers(parsedCorrectAnswers)
    }

    const storedWrongAnswers = localStorage.getItem("wrongAnswers")
    let parsedWrongAnswers = 0

    if (storedWrongAnswers) {
      parsedWrongAnswers = JSON.parse(storedWrongAnswers)
      setWrongAnswers(parsedWrongAnswers)
    }

    if (storedCorrectAnswers && storedWrongAnswers) {
      setCorrectAnswersPercentage(
        (
          (parsedCorrectAnswers / (parsedCorrectAnswers + parsedWrongAnswers)) *
          100
        ).toFixed(0)
      )
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {correctAnswers || wrongAnswers ? (
        <div>
          {showStats ? (
            <div className={styles.userStats}>
              <h2>Your Stats</h2>
              <IoMdClose
                className={styles.closeBtn}
                onClick={() => dispatch(setShowStats(false))}
              />
              <p>Correct Answers: {correctAnswers}</p>
              <p>Wrong Answers: {wrongAnswers}</p>
              {correctAnswersPercentage && (
                <p>
                  You answer correctly{" "}
                  <span
                    className={
                      Number(correctAnswersPercentage) >= 50
                        ? styles.goodScore
                        : styles.badScore
                    }
                  >
                    {correctAnswersPercentage}%
                  </span>{" "}
                  of the time
                </p>
              )}
              <button onClick={() => {localStorage.clear(); setCorrectAnswers(0); setWrongAnswers(0)}}>Reset Stats</button>
            </div>
          ) : (
            <div
              className={styles.userStatsMinified}
              onClick={() => dispatch(setShowStats(true))}
            >
              <p>STATS</p>
            </div>
          )}
        </div>
      ) : !showStats ? (
        <div className={styles.userStats}>
          <IoMdClose
            className={styles.closeBtn}
            onClick={() => dispatch(setShowStats(true))}
          />
          <p className={styles.noStatsInfo}>After you play a game, your stats will appear here!</p>
        </div>
      ) : (
        <div
          className={styles.userStatsMinified}
          onClick={() => dispatch(setShowStats(false))}
        >
          <p>STATS</p>
        </div>
      )}
    </>
  )
}

export default UserStats
