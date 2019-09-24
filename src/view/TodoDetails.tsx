import { TodoDetailsLogic, createTodoDetailsLogic } from "../logic/todoDetails"
import React, { Fragment } from "react"
import { makeStyles } from '@material-ui/styles'
import { Typography, IconButton, Dialog } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const todo = {
  id: '1',
  name: 'tralalalla asldfjk asdljf ',
  description: `asdlkfj asdklčfj asdfjk asdčflkj asdčfklj asdčfklja sdlkfja sčdlfkja sdklfja lsdfkaj sdf
asdf alčsdkjf čalskdjf čalksdjf asdf
asd asdf asčdklfj aklsdjf 
f asdfasdkfj alsčdkjf ačklsdjf čalskdjf čaklsdjf člasjdkf 
`,
  createdAt: new Date()
}

const useStyles = makeStyles({
  actions: {
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
})

interface TodoDetailsProps {
  className?: string 
  startEdit: () => void
  delete: () => void
}

export const TodoDetails = (p: TodoDetailsProps) => {

  const classes = useStyles()

  return (
    <div className={p.className}>
      <div className={classes.actions}>
        <div className={classes.actionsLeft}>
          <IconButton className={classes.button}>
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
      <div className={classes.prop}>
        <Typography className={classes.propLabel}>Name:</Typography>
        <Typography className={classes.propValue}>{todo.name}</Typography>
      </div>
      <div className={classes.prop}>
        <Typography className={classes.propLabel}>Description:</Typography>
        <Typography className={classes.propValue}>{todo.description}</Typography>
      </div>
      <div className={classes.prop}>
        <Typography className={classes.propLabel}>Created at:</Typography>
        <Typography className={classes.propValue}>{todo.createdAt.toString()}</Typography>
      </div>
    </div>
  )
}