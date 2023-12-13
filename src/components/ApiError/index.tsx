import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { goBack } from "../../features/gameSlice"
import styles from "./style.module.scss"

const ApiError = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { responseCode } = useSelector((state: RootState) => state.game)

  return (
    <div className={styles.errorContainer}>
      {!responseCode && (
        <h1>
          Looks like we're having some problems connecting with the API, please
          try again later!
        </h1>
      )}
      {responseCode === 1 && (
        <h1>
          Results aren't available because the database lacks sufficient
          questions for your settings.
        </h1>
      )}
      {responseCode === 2 && (
        <h1>Something went wrong when trying to apply your settings.</h1>
      )}
      {responseCode === 4 && (
        <>
          <h1>
            Results aren't available because the database lacks sufficient
            questions for your settings or all questions matching your settings
            have been answered.
          </h1>
          <p>
            If the database lacks sufficient questions for your settings,
            consider adjusting them to access more questions.
          </p>
          <p>
            If you've exhausted all the questions in this category, choosing to
            play another game with these settings may lead to encountering
            previously answered questions.
          </p>
        </>
      )}
      {responseCode === 5 && (
        <h1>
          Rate Limit: Too many requests have occurred. You can only generate new
          questions once every 5 seconds!
        </h1>
      )}
      <button onClick={() => dispatch(goBack())}>Go Back</button>
    </div>
  )
}

export default ApiError
