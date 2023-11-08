import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../app/store"
import { fetchCategories } from "../../features/categorySlice"
import Category from "../Category"
import { TriviaCategories, TriviaCategory } from "../../interface/category"
import NestedCategory from "../NestedCategory"

const CategoryList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    multiCategory,
    singleCategory,
    multiCategoryTitle,
    nestedCategories,
    loading,
  } = useSelector((state: RootState) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])
  console.log(multiCategory)
  console.log(singleCategory, "singlecat")

  return (
    <div>
      {nestedCategories.length > 0 && 
        nestedCategories.map((cat: TriviaCategory) => (
          <Category key={cat.id} name={cat.name} id={cat.id} nested/>
        )) }
          <h1>Single Categories</h1>
          {singleCategory.map((category) => (
            <Category key={category.id} name={category.name} id={category.id} />
          ))}
          <h1>Multi Categories</h1>
          {multiCategoryTitle.map((category) => (
            <NestedCategory key={category} name={category} />
          ))}      
    </div>
  )
}

export default CategoryList
