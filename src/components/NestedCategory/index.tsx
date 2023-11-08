import React from 'react'
import {TriviaCategory} from "../../interface/category"
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../app/store'
import {setNestedCategory} from "../../features/categorySlice"

const NestedCategory = ({name}: {name: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div onClick={() => dispatch(setNestedCategory(name))}>
      {name}
    </div>
  )
}

export default NestedCategory