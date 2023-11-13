import React from "react"
import { AppDispatch } from "../../store/store"
import { useDispatch } from "react-redux"
import { setCurrentCategory } from "../../features/gameSlice"
import styles from "./style.module.scss"

const Category = ({
  name,
  id,
  nested,
}: {
  name: string
  id?: number
  nested?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      {nested ? (
        <button className={styles.category} onClick={() => dispatch(setCurrentCategory({name, id}))}>{name.slice(name.indexOf(":") + 2)}</button>
      ) : (
        <button className={styles.category} onClick={() => dispatch(setCurrentCategory({name, id}))}>{name}</button>
      )}
    </>
  )
}

export default Category
