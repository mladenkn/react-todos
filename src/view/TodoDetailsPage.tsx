import { makeStyles } from "@material-ui/styles"
import { useTodoDetailsLogic } from "../logic/todoDetails"
import React, { Fragment } from "react"
import { Dialog } from "@material-ui/core"
import { TodoDetails } from "./TodoDetails"
import { TodoEditor } from "./TodoEditor"
import { createTodoApi } from "../logic/todoApi"


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

export const TodoDetailsPage = () => {
  const classes = usePageStyles()
  
  const logic = useTodoDetailsLogic({
    todoId: '1',
    todoApi: createTodoApi(),
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