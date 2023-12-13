import React, { useEffect } from "react"
import Settings from "../components/Settings"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store/store"
import CategoryList from "../components/CategoryList"
import Game from "../components/Game"
import styles from "./style.module.scss"
import ApiError from "../components/ApiError"
import {
  fetchResetSessionToken,
  fetchSessionToken,
} from "../features/gameSlice"

const renderStep = (step: number) => {
  switch (step) {
    case 0:
      return <CategoryList />
    case 1:
      return <Settings />
    case 2:
      return <Game />
    default:
      return null
  }
}

function App() {
  const {
    step,
    loadingCategories,
    loadingCustomGame,
    loadingQuickGame,
    responseCode,
    sessionToken,
  } = useSelector((state: RootState) => state.game)
  const apiError =
    loadingCategories === "rejected" ||
    loadingCustomGame === "rejected" ||
    loadingQuickGame === "rejected" ||
    (responseCode > 0 && responseCode < 6)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!sessionToken) {
      dispatch(fetchSessionToken())
    }

    if (responseCode === 4) {
      dispatch(fetchResetSessionToken())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseCode])

  return (
    <div
      style={{ backgroundImage: `url('/images/bg.svg')` }}
      className={styles.bgWrapper}
    >
      <div className={styles.app}>
        {!apiError && renderStep(step)}
        {apiError && <ApiError />}
      </div>
    </div>
  )
}

export default App
