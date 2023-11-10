import React from 'react'
import { useDispatch } from 'react-redux'
import {
  goBack,
} from "../../features/gameSlice"
import { AppDispatch } from '../../app/store'

const BackBtn = () => {
  const dispatch = useDispatch<AppDispatch>()
  return (
    <h1 onClick={() => dispatch(goBack())}>{'<'}</h1>
  )
}

export default BackBtn