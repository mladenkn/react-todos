import { TodoDetailsLogic } from "../logic/todoDetailsSection"
import React from "react"
import { makeStyles } from '@material-ui/styles'
import { Typography, IconButton } from '@material-ui/core'
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

export const TodoDetails = (p: {className?: string, /*logic: TodoDetailsLogic*/}) => {

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
          <IconButton className={classes.button}>
            <EditIcon />
          </IconButton>
          <IconButton className={classes.button}>
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

const usePageStyles = makeStyles({
  root: {
    padding: '1em',
    width: '30em'
  }
})

export const TodoDetailsPage = () => {
  const classes = usePageStyles()
  return <TodoDetails className={classes.root} />
}