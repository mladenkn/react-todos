import { makeStyles } from "@material-ui/styles";
import { Tooltip, Typography, IconButton, TextField, Theme, createStyles } from "@material-ui/core";
import React from "react";
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { lighten } from "@material-ui/core/styles";

interface EnhancedTableToolbarProps {
  numSelected: number
  onDelete: () => void
  searchQuery?: string
  onSearchQueryChange: (q: string) => void
  onTodoAddClick: () => void
}

const sharedStyles = createStyles({
  root: {
    height: '6em',
    boxSizing: 'border-box',
  },
})

const useRootSelectedStyles = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.secondary.main,
    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    display: 'flex',
    alignItems: 'center',
    ...sharedStyles.root,    
  },
  title: {
    fontSize: '2em',
    marginLeft: '0.8em',
  },
  deleteAction: {
    marginLeft: '60.5%'
  },
}))

const useRootNormalStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'initial',
    padding: '1em 0em 0.7em 1.5em',
    ...sharedStyles.root,
  },
  title: {
    fontSize: '2.8em',
  },
  searchField: {
    marginLeft: '22%',
    marginTop: '0.2em',
    width: '15em',
  },
  addTodoAction: {
    marginLeft: '1em',
    padding: '0.8em',
  },
})

export const TodoTableToolbar = (p: EnhancedTableToolbarProps) => {
  const selectedClasses = useRootSelectedStyles()
  const normalClasses = useRootNormalStyles()
  
  const { numSelected } = p;
 
  return (
    <div>
      {numSelected > 0 ? (
        <div className={selectedClasses.root}>
          <Typography className={selectedClasses.title} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
          <Tooltip title="Delete">
            <IconButton className={selectedClasses.deleteAction} onClick={p.onDelete} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ) : (
        <div className={normalClasses.root}>
          <Typography className={normalClasses.title} color='primary' variant="h6" id="tableTitle">
            Todos
          </Typography>     
          <TextField 
            className={normalClasses.searchField} 
            label='Search' 
            type='search' 
            value={p.searchQuery}
            onChange={e => p.onSearchQueryChange(e.target.value)}
          />
          <IconButton className={normalClasses.addTodoAction} onClick={p.onTodoAddClick}>
            <PostAddIcon />
          </IconButton>       
        </div>
        )
      }
    </div>
  );
};
