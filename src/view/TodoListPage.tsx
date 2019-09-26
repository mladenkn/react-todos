import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import TodoTableExample from './TodoTableExample'
import { TodoListItem, TodoDataApi } from '../logic/todoDataApi';
import { PagedListSearchParams } from '../utils';
import { useTodoListSectionLogic } from '../logic/todoListSection';

const useStyles = makeStyles({
  root: {
    padding: '1.5em'
  },
})

export const TodoListPage = (p: {api: TodoDataApi}) => {

  const classes = useStyles()

  const [searchParams, setSearchParams] = useState<PagedListSearchParams<TodoListItem>>({
    order: 'asc',
    orderBy: 'createdAt',
    page: 0,
    rowsPerPage: 5,
  })

  const todoList = p.api.fetchList(searchParams)
  const logic = useTodoListSectionLogic({api: p.api})
  
  console.log(searchParams)
  console.log(todoList)

  return (
    <div className={classes.root}>
      <TodoTableExample 
        todos={todoList.data} 
        todoTotatCount={todoList.totalCount}
        lastSearchParams={searchParams}
        onSearchParamsChange={setSearchParams}
        onDeleteClick={logic.delete}
        onEditClick={() => {}}
      />
    </div>
  )
}