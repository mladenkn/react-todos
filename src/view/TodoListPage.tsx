import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import TodoTableExample from './TodoTableExample'
import { TodoListItem, TodoDataApi } from '../logic/todoDataApi';
import { useTodoListSectionLogic } from '../logic/todoListSection';
import { RequestStatus, PagedListSearchParams } from '../utils';
import { Dialog, Typography, Button } from '@material-ui/core';
import { TodoEditor } from './TodoEditor';

const useStyles = makeStyles({
  root: {
    padding: '1.5em'
  },
  todoEditor: {
    padding: '1em',
    width: '35em',
  },
})

const initalSearchParams: PagedListSearchParams<TodoListItem> = {
  order: 'desc',
  orderBy: 'createdAt',
  page: 0,
  rowsPerPage: 10,   
}

export const TodoListPage = (p: {api: TodoDataApi}) => {

  const classes = useStyles()
  const logic = useTodoListSectionLogic({api: p.api})
  useEffect(() => {
    logic.fetchList(initalSearchParams)
  }, [])
  const fetchStatus: RequestStatus = logic.todos.loadStatus ? logic.todos.loadStatus : 'REQUEST_PENDING'

  console.log(logic)

  const isEditing = logic.lastEdit && (logic.lastEdit.status === "USER_EDITING")
  const isCreating = logic.lastCreate && (logic.lastCreate.status === "USER_CREATING")
  const shouldConfirmEdit = logic.lastDelete && (logic.lastDelete.status === 'UNCONFIRMED')

  return (
    <div className={classes.root}>
      <TodoTableExample 
        todos={{
          data: logic.todos.data,
          fetchStatus: fetchStatus,
          totalCount: logic.todos.totalCount
        }}
        lastSearchParams={(logic.todoListSearchParams || initalSearchParams) as any}
        onSearchParamsChange={logic.fetchList}
        onDeleteClick={logic.delete}
        onDeleteSelectedClick={logic.deleteSelected}
        onEditClick={logic.beginEdit}
        toggleItemSelect={logic.toggleTodoSelect}
        toggleAllSelect={logic.toggleSelectAll}
      />
      {isEditing &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            todoInitial={logic.lastEdit!.todo!}
            onCancel={logic.cancelEdit}
            onSubmit={logic.finishEdit}
          />
        </Dialog>
      }
      {isCreating &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            onCancel={logic.cancelCreate}
            onSubmit={logic.finsihCreate}
          />
        </Dialog>
      }
      {shouldConfirmEdit && 
        <ConfirmDeleteDialog onConfirm={logic.confirmDelete} onCancel={logic.cancelDelete} />}
    </div>
  )
}

const useConfirmDeleteDialogStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: '9.5em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    marginTop: '1em',
    width: '100%',
    justifyContent: 'space-between',
  },
})

const ConfirmDeleteDialog = (p: {onConfirm: () => void, onCancel: () => void}) => {
  const classes = useConfirmDeleteDialogStyles()
  return (
    <Dialog open={true} onClose={p.onCancel}>
      <div className={classes.root}>
        <Typography>Are you sure?</Typography>
        <div className={classes.actions}>
          <Button size='small' onClick={p.onCancel} variant='outlined' color='secondary'>Cancel</Button>
          <Button size='small' onClick={p.onConfirm} variant='outlined' color='primary'>OK</Button>
        </div>
      </div>
    </Dialog>
  )
}