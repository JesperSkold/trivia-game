import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store"
import { fetchCategories, fetchQuickGame } from "../../features/gameSlice"
import Category from "../Category"
import { TriviaCategories, TriviaCategory } from "../../interface/category"

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    multiCategory,
    singleCategory,
    multiCategoryTitle,
    allCategories
  } = useSelector((state: RootState) => state.game)

  useEffect(() => {
    if (!allCategories.trivia_categories.length) {
      dispatch(fetchCategories())
    }
  }, [dispatch])

  return (
    <div>
      <button onClick={() => dispatch(fetchQuickGame())}>Quick Play</button>
      <h1>General Categories</h1>
      {singleCategory.map((category) => (
        <Category key={category.id} name={category.name} id={category.id} />
      ))}
      {multiCategoryTitle.map((category) => (
        <div key={category}>
          <h1>{category}</h1>
          {multiCategory?.map(
            (cat: TriviaCategory) =>
              cat.name.includes(category) && (
                <Category key={cat.id} name={cat.name} id={cat.id} nested />
              )
          )}
        </div>
      ))}
    </div>
  )
}
export default CategoryList
