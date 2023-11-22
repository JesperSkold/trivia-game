import React from "react"
import { useDispatch } from "react-redux"
import { goBack } from "../../features/gameSlice"
import { AppDispatch } from "../../store/store"
import { BiArrowBack } from "react-icons/bi"
import styles from "./style.module.scss"

const BackBtn = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <BiArrowBack
      className={styles.backBtn}
      onClick={() => dispatch(goBack())}
    />
  )
}

export default BackBtn
