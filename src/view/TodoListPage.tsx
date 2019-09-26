import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import TodoTableExample from './TodoTableExample'
import { TodoListItem, TodoDataApi } from '../logic/todoDataApi';
import { useTodoListSectionLogic } from '../logic/todoListSection';

const useStyles = makeStyles({
  root: {
    padding: '1.5em'
  },
})

export const TodoListPage = (p: {api: TodoDataApi}) => {

  const classes = useStyles()

  const logic = useTodoListSectionLogic({api: p.api})

  return (
    <div className={classes.root}>
      <TodoTableExample 
        todos={{
          data: logic.todos.data,
          fetchStatus: logic.todos.loadStatus,
          totalCount: logic.todos.totalCount
        }} 
        lastSearchParams={logic.todoListSearchParams as any}
        onSearchParamsChange={logic.setSearchParams}
        onDeleteClick={logic.delete}
        onEditClick={logic.beginEdit}
      />
    </div>
  )
}