import { TodoListItem } from "../../logic/todoDataApi";
import { makeStyles } from "@material-ui/styles";
import { TableRow, Checkbox, TableHead, TableCell, TableSortLabel } from "@material-ui/core";
import React from "react";

const todoPropsHeadCells = [
  { id: 'name' as keyof TodoListItem, disablePadding: true, label: 'Name' },
  { id: 'createdAt' as keyof TodoListItem, disablePadding: false, label: 'Created at' },
]

interface Props {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof TodoListItem) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: 'asc' | 'desc';
  orderBy: string;
  checkBoxChecked: boolean
  checkBoxIndeterminate: boolean
}

const useTodoTableHeadStyles = makeStyles({
  checkBoxCell: {
    width: '7em',
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
})

export const TodoTableHead = (props: Props) => {
  const classes = useTodoTableHeadStyles()
  const { onSelectAllClick, order, orderBy, onRequestSort } = props;
  
  const createSortHandler = (property: keyof TodoListItem) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.checkBoxCell} padding="checkbox">
          <Checkbox
            indeterminate={props.checkBoxIndeterminate}
            checked={props.checkBoxChecked}
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
        <TableCell />
      </TableRow>
    </TableHead>
  );
}