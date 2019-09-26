import { makeStyles } from "@material-ui/styles"
import { useTodoDetailsLogic } from "../logic/todoDetails"
import React, { Fragment } from "react"
import { Dialog } from "@material-ui/core"
import { TodoDetails } from "./TodoDetails"
import { TodoEditor } from "./TodoEditor"
import { TodoDataApi } from "../logic/todoDataApi"


const usePageStyles = makeStyles({
  root: {
    padding: '1em',
    width: '30em'
  },
  todoEditor: {
    padding: '1em',
    width: '30em',
  }
})

export const TodoDetailsPage = (p: {todoId: number, api: TodoDataApi}) => {
  const classes = usePageStyles()
  
  const logic = useTodoDetailsLogic({
    todoId: p.todoId,
    todoApi: p.api,
    onDelete: () => {}
  });
  (window as any).logic = logic
  console.log(logic)
  
  return (
    <Fragment>    
    {logic.editingStatus === 'EDITING' &&
      <Dialog open={true} onClose={logic.cancelEdit}>
        <TodoEditor 
          className={classes.todoEditor}
          todoInitial={logic.todo!} 
          onSubmit={logic.finishEdit} 
          onCancel={logic.cancelEdit}
          status={logic.editingStatus!} 
        />
      </Dialog>
    }
      <TodoDetails 
        todo={logic.todo!} 
        todoFetchStatus={logic.todoFetchStatus}
        className={classes.root} 
        startEdit={logic.startEdit} 
        delete={logic.delete} 
      />
    </Fragment>
  )
}