import React from "react"
import { AppDispatch } from "../../app/store"
import { useDispatch } from "react-redux"
import { setCurrentCategory } from "../../features/gameSlice"

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
    <div>
      {nested ? (
        <li onClick={() => dispatch(setCurrentCategory({name, id}))}>{name.slice(name.indexOf(":") + 2)}</li>
      ) : (
        <li onClick={() => dispatch(setCurrentCategory({name, id}))}>{name}</li>
      )}
    </div>
  )
}

export default Category
