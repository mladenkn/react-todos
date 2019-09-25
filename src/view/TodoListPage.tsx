import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import TodoTableExample, { TodoListItem } from './TodoTableExample'
import { createTodoLocalStorageDataApi } from '../logic/todoLocalStorageDataApi';
import { PagedListSearchParams } from '../utils';

const useStyles = makeStyles({

})

export const TodoListPage = () => {

  const classes = useStyles()

  const [searchParams, setSearchParams] = useState<PagedListSearchParams<TodoListItem>>({
    order: 'asc',
    orderBy: 'createdAt',
    page: 0,
    rowsPerPage: 5,
  })

  const api = createTodoLocalStorageDataApi()
  const todoList = api.fetchList(searchParams)
  
  console.log(searchParams)
  console.log(todoList)

  return (
    <div>
      <TodoTableExample 
        rows={todoList.data} 
        todoTotatCount={todoList.totalCount}
        lastSearchParams={searchParams}
        onSearchParamsChange={setSearchParams}
      />
    </div>
  )
}