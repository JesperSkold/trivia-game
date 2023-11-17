import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import styles from "./style.module.scss"
import { goBack } from "../../features/gameSlice"
const ApiError = () => {
  const { responseCode } = useSelector((state: RootState) => state.game)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div className={styles.errorContainer}>
      {!responseCode && (
        <h1>
          Looks like we're having some problems connecting with the API, please
          try again later!
        </h1>
      )}
      {responseCode === 5 && (
        <h1>
          Rate Limit: Too many requests have occurred. You can only generate new
          questions once every 5 seconds!
        </h1>
      )}
      {responseCode === 1 && (
        <h1>
          Could not return results. This could be because the API doesn't have
          enough questions in the specified category; try changing the settings and lower the amount of
          questions or choose another category!
        </h1>
      )}
      {responseCode === 2 && <h1>Something went wrong when trying to apply your settings</h1>}
      <button onClick={() => dispatch(goBack())}>Go Back</button>
    </div>
  )
}

export default ApiError
