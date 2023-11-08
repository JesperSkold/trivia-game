import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'

const Category = ({name, id, nested}: {name: string, id: number, nested?: boolean }) => {
  
  return (
    <div>
      {nested ? (<li>{ name.slice(name.indexOf(":")+2)}</li>) : (<li>{name}</li>)}
    </div>
  )
}

export default Category