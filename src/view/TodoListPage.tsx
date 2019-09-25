import React from 'react'
import { makeStyles } from '@material-ui/styles'
import TodoTableExample from './TodoTableExample'
import { createTodoLocalStorageDataApi } from '../logic/todoLocalStorageDataApi';

const useStyles = makeStyles({

})

export const TodoListPage = () => {

  const classes = useStyles()

  const api = createTodoLocalStorageDataApi()
  const rows = api.fetchList().map(t => ({ name: t.name, createdAt: t.createdAt.toString()}))

  return (
    <div>
      <TodoTableExample rows={rows} />
    </div>
  )
}