import { TodoListItem } from "../../logic/todoDataApi";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { TableBody, TableRow, Checkbox, IconButton, Tooltip, TableCell, Link } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DescriptionIcon from '@material-ui/icons/Description';

interface Props {
  todos: (TodoListItem & {isSelected: boolean})[]

  onTodoSelect: (todoId: number) => void
  onEditClick: (event: React.MouseEvent<unknown>, todoId: number) => void
  onDeleteClick: (event: React.MouseEvent<unknown>, todoId: number) => void
}

const useTableBodyStyles = makeStyles({
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
}, {name: 'TableBody'})

export const TodoTableBody = (p: Props) =>
{
  const classes = useTableBodyStyles()
  return (
    <TableBody>
      {p.todos.map((todo, index) => {
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
          <TableRow 
            hover 
            onClick={() => p.onTodoSelect(todo.id)} 
            role="checkbox" 
            aria-checked={todo.isSelected} 
            tabIndex={-1} 
            key={todo.id} 
            selected={todo.isSelected}
          >
            <TableCell padding="checkbox">
              <Checkbox checked={todo.isSelected} inputProps={{ 'aria-labelledby': labelId }} />
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
                  onClick={event => p.onEditClick(event, todo.id)} 
                  className={classes.actionButton} 
                  size='small'
                >
                  <EditIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton 
                  onClick={event => p.onDeleteClick(event, todo.id)} 
                  className={classes.actionButton} 
                  size='small'
                >
                  <DeleteIcon className={classes.actionIcon} />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )
      })
    }
    </TableBody>
  )  
}