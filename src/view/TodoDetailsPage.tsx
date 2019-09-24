import { makeStyles } from "@material-ui/styles"
import { createTodoDetailsLogic } from "../logic/todoDetails"
import React, { Fragment } from "react"
import { Dialog } from "@material-ui/core"
import { TodoDetails } from "./TodoDetails"
import { TodoEditor } from "./TodoEditor"


const usePageStyles = makeStyles({
  root: {
    padding: '1em',
    width: '30em'
  }
})

export const TodoDetailsPage = () => {
  const classes = usePageStyles()
  const logic = createTodoDetailsLogic()
  return (
    <Fragment>
      <Dialog open={!logic.editingStatus}>
        <TodoEditor todoInitial={logic.todo!} onSubmit={logic.finishEdit} status={logic.editingStatus!} />
      </Dialog>
      <TodoDetails className={classes.root} startEdit={logic.startEdit} delete={logic.delete} />
    </Fragment>
  )
}