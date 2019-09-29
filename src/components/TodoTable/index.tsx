import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Table, TablePagination } from '@material-ui/core'
import { Paper, CircularProgress } from '@material-ui/core'
import { PagedListSearchParams, RequestStatus } from '../../utils';
import { TodoTableHead } from './TodoTableHead';
import { TodoTableToolbar } from './TodoTableToolbar';
import { TodoTableBody } from './TodoTableBody';
import { Todo } from '../../dataAccess/todoDataApi';

export type TodoListItem = Omit<Todo, 'description'>

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    paper: {
      marginBottom: theme.spacing(2),
    },
    table: {
    },
    tableWrapper: {
      overflowX: 'auto',
      minHeight: '26em',
      minWidth: '38em',
    },
    paginationContainer: {
      height: '3.5em'
    },
    circularProgressContainer: {
      marginTop: '25%',
      marginLeft: '40%',
    },
    circularProgress: {
      width: '6em',
    },
  }), { name: 'Table' },
)

export interface Props {
  todos: {
    data?: (TodoListItem & {isSelected: boolean})[]
    fetchStatus?: RequestStatus
    totalCount?: number
  }
  lastSearchParams: PagedListSearchParams<TodoListItem>
  
  onSearchParamsChange: (p: PagedListSearchParams<TodoListItem>) => void
  onEditClick: (todoId: number) => void
  onDeleteClick: (todoIds: number) => void
  onDeleteSelectedClick: () => void
  toggleItemSelect: (todoId: number) => void
  toggleAllSelect: () => void
  onTodoAddClick: () => void
}

export function TodoTable(p: Props) {
  
  const classes = useStyles()

  const { order, orderBy, page, rowsPerPage, searchQuery } = p.lastSearchParams
  const todos = p.todos.data
  const todosTotalCount = p.todos.totalCount

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TodoListItem) => {
    const isDesc = orderBy === property && order === 'desc'
    p.onSearchParamsChange({...p.lastSearchParams, order: isDesc ? 'asc' : 'desc', orderBy: property})
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    p.onSearchParamsChange({...p.lastSearchParams, page: newPage})
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    p.onSearchParamsChange({ ...p.lastSearchParams, rowsPerPage: +event.target.value, page: 0 })
  }

  const handleSearchQueryChange = (searchQuery: string) => {
    p.onSearchParamsChange({ ...p.lastSearchParams, searchQuery, page: 0 })
  }

  const getPagination = () => 
    <TablePagination
      rowsPerPageOptions={[6, 10, 25]}
      component="div"
      count={todosTotalCount!}
      rowsPerPage={rowsPerPage}
      page={page}
      backIconButtonProps={{
        'aria-label': 'previous page',
      }}
      nextIconButtonProps={{
        'aria-label': 'next page',
      }}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />

  const fetched = p.todos.fetchStatus === 'REQUEST_SUCCEESS'
  const fetching = p.todos.fetchStatus === 'REQUEST_PENDING'
  const fetchError = p.todos.fetchStatus === 'REQUEST_FAILED'

  const selectedTodosCount = todos ? todos.filter(t => t.isSelected).length : 0
  const usePagination = p.todos && p.todos.totalCount && (p.todos.totalCount > 5)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TodoTableToolbar 
          onDelete={p.onDeleteSelectedClick} 
          numSelected={selectedTodosCount} 
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          onTodoAddClick={p.onTodoAddClick}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <TodoTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={p.toggleAllSelect}
              onRequestSort={handleRequestSort}
              checkBoxChecked={fetched ? (selectedTodosCount === todos!.length) : false}
              checkBoxIndeterminate={
                fetched ? (selectedTodosCount > 0 && selectedTodosCount < todos!.length) : false
              }
            />
            {fetched &&
              <TodoTableBody 
                todos={todos!}
                onTodoSelect={p.toggleItemSelect}
                onEditClick={p.onEditClick}
                onDeleteClick={p.onDeleteClick}
              />
            }
          </Table>
          {fetching &&
            <div className={classes.circularProgressContainer}>
              <CircularProgress size={100} className={classes.circularProgress} />
            </div>
          }
          {fetchError && 
            <div>fetch error</div>
          }
        </div>
        <div className={classes.paginationContainer}>
          {fetched && usePagination && getPagination()}
        </div>
      </Paper>
    </div>
  )
}