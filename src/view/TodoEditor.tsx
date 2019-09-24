import React from 'react'
import { makeStyles } from "@material-ui/core"
import { Todo } from '../logic/shared'
import { RequestStatus } from '../utils'

const useStyles = makeStyles({

})

interface Props {
  todoInitial: Omit<Todo, 'id'>
  onSubmit: (todo: Todo) => void
  status: 'EDITING' | RequestStatus
}

export const TodoEditor = (p: Props) => {
  const classes = useStyles()
  return (
    <div>
    </div>
  )
}