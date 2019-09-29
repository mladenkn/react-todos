import { makeStyles } from "@material-ui/styles";
import { Tooltip, Typography, Toolbar, IconButton, TextField, Theme, createStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import clsx from "clsx";
import DeleteIcon from '@material-ui/icons/Delete';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { lighten } from "@material-ui/core/styles";

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
      marginBottom: '0.5em',
      paddingTop: '0.5em',
      height: '5em',
    },
    highlight:{
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
    actions: {
      marginLeft: '13em',      
    },
    titleContainer: {
    },
    selectedCount: {
      fontSize: '2em',
    },
    title: {
      fontSize: '3em',
    },
    searchField: {
      width: '12em',
    },
    deleteAction: {
      marginLeft: '6.4em',
    },
  }), { name: 'Toolbar'},
);

interface EnhancedTableToolbarProps {
  numSelected: number
  onDelete: () => void
  searchQuery?: string
  onSearchQueryChange: (q: string) => void
  onTodoAddClick: () => void
}

export const TodoTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
 
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.titleContainer}>
        {numSelected > 0 ? (
          <Typography className={classes.selectedCount} color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.title} color='primary' variant="h6" id="tableTitle">
            Todos
          </Typography>
        )}
      </div>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton className={classes.deleteAction} onClick={props.onDelete} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Fragment>
            <TextField 
              className={classes.searchField} 
              label='Search' 
              type='search' 
              value={props.searchQuery}
              onChange={e => props.onSearchQueryChange(e.target.value)}
            />
            <IconButton onClick={props.onTodoAddClick}>
              <PostAddIcon />
            </IconButton>
          </Fragment>
        )}
      </div>
    </Toolbar>
  );
};
