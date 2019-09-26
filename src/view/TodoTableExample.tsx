import React from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';
import FilterListIcon from '@material-ui/icons/FilterList';
import { PagedListSearchParams } from '../utils';
import { Link } from '../utils/components';
import { TodoListItem } from '../logic/todoDataApi';

type Order = 'asc' | 'desc'

const todoPropsHeadCells = [
  // { id: 'id', disablePadding: true, label: 'Id' },
  { id: 'name' as keyof TodoListItem, disablePadding: true, label: 'Name' },
  { id: 'createdAt' as keyof TodoListItem, disablePadding: false, label: 'Created at' },
]

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TodoListItem) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof TodoListItem) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.checkBoxCell} padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {todoPropsHeadCells.map(cell => (
          <TableCell
            key={cell.id}
            align='left'
            padding={cell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === cell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === cell.id}
              direction={order}
              onClick={createSortHandler(cell.id)}
            >
              {cell.label}
              {orderBy === cell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell className={classes.actionHeadCell}>
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  }), { name: 'Toolbar'},
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Todos
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

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
    checkBoxCell: {
      width: '7em',
    },
    actionHeadCell: {
      paddingLeft: '2.1em'
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
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
  }), { name: 'Table' },
)

export interface Props {
  todos: TodoListItem[]
  todoTotatCount: number
  lastSearchParams: PagedListSearchParams<TodoListItem>
  
  onSearchParamsChange: (p: PagedListSearchParams<TodoListItem>) => void
  onEditClick: (todoId: number) => void
  onDeleteClick: (todoIds: number[]) => void
}

export default function EnhancedTable(p: Props) {
  
  const classes = useStyles()

  const { order, orderBy, page, rowsPerPage } = p.lastSearchParams
  const { todos: todos, todoTotatCount } = p

  const [selectedIds, setSelectedIds] = React.useState<number[]>([])
  console.log(selectedIds)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof TodoListItem) => {
    const isDesc = orderBy === property && order === 'desc'
    p.onSearchParamsChange({...p.lastSearchParams, order: isDesc ? 'asc' : 'desc', orderBy: property})
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked)
      setSelectedIds(todos.map(n => n.id))
    else
      setSelectedIds([])
  }

  const handleRowClick = (id: number) => {
    if(selectedIds.includes(id))
      setSelectedIds(selectedIds.filter(id_ => id_ !== id))
    else
      setSelectedIds(selectedIds.concat(id))
  }

  const onEditClick = (event: React.MouseEvent<unknown>, todoId: number) => {
    event.stopPropagation()
    p.onEditClick(todoId)
  }

  const onDeleteClick = (event: React.MouseEvent<unknown>, todoId: number) => {
    event.stopPropagation()
    p.onDeleteClick([todoId])
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    p.onSearchParamsChange({...p.lastSearchParams, page: newPage})
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    p.onSearchParamsChange({ ...p.lastSearchParams, rowsPerPage: +event.target.value, page: 0 })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selectedIds.length} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selectedIds.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={todos.length}
            />
            <TableBody>
              {todos.map((todo, index) => {
                const isItemSelected = selectedIds.includes(todo.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={() => handleRowClick(todo.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={todo.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
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
                          onClick={event => onDeleteClick(event, todo.id)} 
                          className={classes.actionButton} 
                          size='small'
                        >
                          <DeleteIcon className={classes.actionIcon} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={todoTotatCount}
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
      </Paper>
    </div>
  );
}