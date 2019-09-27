import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Table, TableRow, TablePagination, TableCell, TableBody } from '@material-ui/core'
import { Paper, Checkbox, IconButton, Tooltip, CircularProgress } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import { PagedListSearchParams, RequestStatus } from '../../utils';
import { Link } from '../../utils/components';
import { TodoListItem } from '../../logic/todoDataApi';
import { TodoTableHead } from './TodoTableHead';
import { TodoTableToolbar } from './TodoTableToolbar';

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
    nameCell: {
      width: '10em'
    },
    createdAtCell: {
      width: '12em',
    },
    actionButton: {
      padding: '0.3em',
      marginRight: '0.5em',
    },
    actionIcon: {
      fontSize: '1.2em',
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

export default function TodoTable(p: Props) {
  
  const classes = useStyles()

  const { order, orderBy, page, rowsPerPage, searchQuery } = p.lastSearchParams
  const todos = p.todos.data
  const todosTotalCount = p.todos.totalCount

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TodoListItem) => {
    const isDesc = orderBy === property && order === 'desc'
    p.onSearchParamsChange({...p.lastSearchParams, order: isDesc ? 'asc' : 'desc', orderBy: property})
  }

  const onEditClick = (event: React.MouseEvent<unknown>, todoId: number) => {
    event.stopPropagation()
    p.onEditClick(todoId)
  }

  const handleDeleteClick = (event: React.MouseEvent<unknown>, todoId: number) => {   
    event.stopPropagation() 
    p.onDeleteClick(todoId)
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

  const getTableBody = () => <TableBody>
    {todos!.map((todo, index) => {
      const labelId = `enhanced-table-checkbox-${index}`
      return (
        <TableRow
          hover
          onClick={() => p.toggleItemSelect(todo.id)}
          role="checkbox"
          aria-checked={todo.isSelected}
          tabIndex={-1}
          key={todo.id}
          selected={todo.isSelected}
        >
          <TableCell padding="checkbox">
            <Checkbox
              checked={todo.isSelected}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          {/* <TableCell align="left">{row.id}</TableCell> */}
          </TableCell>
          <TableCell className={classes.nameCell} component="th" id={labelId} scope="row" padding="none">
            {todo.name}
          </TableCell>
          <TableCell className={classes.createdAtCell} align="left">
            {todo.createdAt.toLocaleDateString()} - {todo.createdAt.toLocaleTimeString()}
          </TableCell>
          <TableCell>
            <Link href={`/todos/${todo.id}`}>
              <Tooltip title="Details">
                <IconButton className={classes.actionButton} size='small'>
                  <DescriptionIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Edit">
              <IconButton 
                onClick={event => onEditClick(event, todo.id)} 
                className={classes.actionButton} 
                size='small'
              >
                <EditIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                onClick={event => handleDeleteClick(event, todo.id)} 
                className={classes.actionButton} 
                size='small'
              >
                <DeleteIcon className={classes.actionIcon} />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
        )
      })}
  </TableBody>

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
            {fetched && getTableBody()}
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