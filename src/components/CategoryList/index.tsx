import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchCategories, fetchQuickGame } from "../../features/gameSlice"
import Category from "../Category"
import { TriviaCategories, TriviaCategory } from "../../interface/category"
import styles from "./style.module.scss"

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { multiCategory, singleCategory, multiCategoryTitle, allCategories } =
    useSelector((state: RootState) => state.game)

  useEffect(() => {
    if (!allCategories.trivia_categories.length) {
      dispatch(fetchCategories())
    }
  }, [dispatch])

  return (
    <div className={styles.categoryList}>
      <h1>Welcome to Trivianado</h1>
      <h3>To start playing, press the quick play button:</h3>
      <button className={styles.quickPlayBtn} onClick={() => dispatch(fetchQuickGame())}>Quick Play</button>
      <section className={styles.categoryContainer}>
      <h3>Alternatively, to customize your game, pick a category:</h3>
        <h1>General Categories</h1>
        <div>
          {singleCategory.map((category) => (
            <Category key={category.id} name={category.name} id={category.id} />
          ))}
        </div>
      </section>
      <section className={styles.categoryContainer}>
        {multiCategoryTitle.map((category) => (
          <React.Fragment key={category}>
            <h1>{category}</h1>
            <div>
              {multiCategory?.map(
                (cat: TriviaCategory) =>
                  cat.name.includes(category) && (
                    <Category key={cat.id} name={cat.name} id={cat.id} nested />
                  )
              )}
            </div>
          </React.Fragment>
        ))}
      </section>
    </div>
  )
}
export default CategoryList
