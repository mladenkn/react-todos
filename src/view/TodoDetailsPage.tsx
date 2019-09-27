import { makeStyles } from "@material-ui/styles"
import { useTodoDetailsLogic } from "../logic/todoDetails"
import React, { Fragment, useEffect } from "react"
import { Dialog } from "@material-ui/core"
import { TodoDetails } from "./TodoDetails"
import { TodoEditor } from "./TodoEditor"
import { TodoDataApi } from "../logic/todoDataApi"
import { useGoBack } from "../utils"


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
  
  const goBack = useGoBack()

  const logic = useTodoDetailsLogic({
    todoId: p.todoId,
    todoApi: p.api,
    onDelete: goBack
  })

  useEffect(() => {
    logic.fetchTodo()
  }, [])
  
  return (
    <Fragment>    
    {logic.editingStatus === 'EDITING' &&
      <Dialog open={true} onClose={logic.cancelEdit}>
        <TodoEditor 
          className={classes.todoEditor}
          todoInitial={logic.todo!} 
          onSubmit={logic.finishEdit} 
          onCancel={logic.cancelEdit}
        />
      </Dialog>
    }
      <TodoDetails 
        todo={logic.todo!} 
        todoFetchStatus={logic.todoFetchStatus}
        className={classes.root} 
        startEdit={logic.startEdit} 
        delete={logic.delete} 
        onGoBack={goBack}
      />
    </Fragment>
  )
}