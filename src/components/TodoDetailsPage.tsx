import { makeStyles } from "@material-ui/styles"
import { useTodoDetailsLogic } from "../stateMgmt/todoDetails"
import React, { Fragment, useEffect } from "react"
import { Dialog } from "@material-ui/core"
import { TodoDetails } from "./TodoDetails"
import { TodoEditor } from "./TodoEditor"
import { useGoBack } from "../utils"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"
import { TodoDataApi } from "../dataAccess/todoDataApi"


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
  const logic = useTodoDetailsLogic({ todoId: p.todoId, api: p.api })

  useEffect(() => {
    if(logic.lastDeleteStatus === 'REQUEST_SUCCEESS')
      goBack()
  }, [logic.lastDeleteStatus])

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
    {logic.lastDeleteStatus === 'UNCONFIRMED' && 
      <Dialog open={true} onClose={logic.cancelDelete}>
        <ConfirmDeleteDialog itemsCount={1} onConfirm={logic.confirmDelete} onCancel={logic.cancelDelete} />
      </Dialog>
    }
      <TodoDetails 
        todo={logic.todo!} 
        todoFetchStatus={logic.todoFetchStatus}
        className={classes.root} 
        startEdit={logic.startEdit} 
        delete={logic.beginDelete} 
        onGoBack={goBack}
      />
    </Fragment>
  )
}