import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../store/store"
import { fetchCategories, fetchQuickGame } from "../../features/gameSlice"
import { TriviaCategory } from "../../interface/category"
import Category from "../Category"
import Loader from "../Loader"
import styles from "./style.module.scss"

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    multiCategory,
    singleCategory,
    multiCategoryTitle,
    allCategories,
    loadingCategories,
    loadingQuickGame,
  } = useSelector((state: RootState) => state.game)

  useEffect(() => {
    if (!allCategories.trivia_categories.length) {
      dispatch(fetchCategories())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <div className={styles.categoryList}>
      <h1 className={styles.title}>Welcome to Trivianado</h1>
      {loadingCategories === "pending" ? (
        <Loader />
      ) : (
        <>
          <h3>To start playing, press the quick play button:</h3>
          {loadingQuickGame === "pending" ? (
            <Loader />
          ) : (
            <button
              className={styles.quickPlayBtn}
              onClick={() => dispatch(fetchQuickGame())}
            >
              Quick Play
            </button>
          )}
          <section className={styles.categoryContainer}>
            <h3>Alternatively, to customize your game, pick a category:</h3>
            <h1>General Categories</h1>
            <div>
              {singleCategory.map((category) => (
                <Category
                  key={category.id}
                  name={category.name}
                  id={category.id}
                />
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
                        <Category
                          key={cat.id}
                          name={cat.name}
                          id={cat.id}
                          nested
                        />
                      )
                  )}
                </div>
              </React.Fragment>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
export default CategoryList
