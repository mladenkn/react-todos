import React from "react"
import { makeStyles } from '@material-ui/styles'
import { Typography, IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import { Todo } from "../logic/shared"
import { RequestStatus } from "../utils"

const useStyles = makeStyles({
  heading: {
    display: 'flex'
  },
  actionsLeft: {

  },
  actionsRight: {
    marginLeft: 'auto',
  },
  button: {
    padding: '0.2em',
  },
  prop: {
    display: 'flex',
    margin: '0.5em',
  },
  propLabel: {
    fontSize: '1em',
    width: '7em',
  },
  propValue: {
    fontSize: '1em',
    width: '80%',
  },
  body: {

  },
})

interface TodoDetailsProps {
  className?: string 
  todo: Todo
  todoFetchStatus?: RequestStatus
  onGoBack: () => void
  startEdit: () => void
  delete: () => void
}

export const TodoDetails = (p: TodoDetailsProps) => {

  const classes = useStyles()

  const getBody = () => {
    switch(p.todoFetchStatus){
      case undefined:
        return <div className={classes.body}>loading...</div>

      case 'REQUEST_PENDING':
        return <div className={classes.body}>loading...</div>

      case 'REQUEST_SUCCEESS': 
        return <div className={classes.body}>
          <div className={classes.prop}>
            <Typography className={classes.propLabel}>Name:</Typography>
            <Typography className={classes.propValue}>{p.todo.name}</Typography>
          </div>
          <div className={classes.prop}>
            <Typography className={classes.propLabel}>Description:</Typography>
            <Typography className={classes.propValue}>{p.todo.description}</Typography>
          </div>
          <div className={classes.prop}>
            <Typography className={classes.propLabel}>Created at:</Typography>
            <Typography className={classes.propValue}>{p.todo.createdAt.toString()}</Typography>
          </div>
        </div>

      case 'REQUEST_FAILED':
        return <div className={classes.body}>error</div>
    }
  }

  return (
    <div className={p.className}>
      <div className={classes.heading}>
        <div className={classes.actionsLeft}>
          <IconButton className={classes.button} onClick={p.onGoBack}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div className={classes.actionsRight}>
          <IconButton className={classes.button} onClick={p.startEdit}>
            <EditIcon />
          </IconButton>
          <IconButton className={classes.button} onClick={p.delete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </div>
      {getBody()}
    </div>
  )
}