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
  rowsPerPage: 6,   
}

export const TodoListPage = (p: {api: TodoDataApi}) => {

  const classes = useStyles()
  const logic = useTodoListSectionLogic({api: p.api})
  useEffect(() => {
    logic.fetchList(initalSearchParams)
  }, [])

  console.log(logic)

  const lastSearchParams = (logic.todoListSearchParams || initalSearchParams) as any
  const fetchStatus: RequestStatus = logic.todos.loadStatus ? logic.todos.loadStatus : 'REQUEST_PENDING'

  return (
    <div className={classes.root}>
      <TodoTableExample 
        todos={{
          data: logic.todos.data,
          fetchStatus: fetchStatus,
          totalCount: logic.todos.totalCount
        }}
        lastSearchParams={lastSearchParams}
        onSearchParamsChange={logic.fetchList}
        onDeleteClick={logic.delete}
        onDeleteSelectedClick={logic.deleteSelected}
        onEditClick={logic.beginEdit}
        toggleItemSelect={logic.toggleTodoSelect}
        toggleAllSelect={logic.toggleSelectAll}
      />
      {logic.isEditing &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            todoInitial={logic.lastEdit!.todo!}
            onCancel={logic.cancelEdit}
            onSubmit={logic.finishEdit}
          />
        </Dialog>
      }
      {logic.isCreating &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            onCancel={logic.cancelCreate}
            onSubmit={logic.finsihCreate}
          />
        </Dialog>
      }
      {logic.shouldConfirmDelete && 
        <Dialog open={true} onClose={logic.cancelDelete}>
          <ConfirmDeleteDialog onConfirm={logic.confirmDelete} onCancel={logic.cancelDelete} />
        </Dialog>
      }
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
      <div className={classes.root}>
        <Typography>Are you sure?</Typography>
        <div className={classes.actions}>
          <Button size='small' onClick={p.onCancel} variant='outlined' color='secondary'>Cancel</Button>
          <Button size='small' onClick={p.onConfirm} variant='outlined' color='primary'>OK</Button>
        </div>
      </div>
  )
}