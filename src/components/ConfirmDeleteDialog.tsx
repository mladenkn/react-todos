import { makeStyles } from "@material-ui/styles"
import React from "react"
import { Typography, Button } from "@material-ui/core"

const useConfirmDeleteDialogStyles = makeStyles({
  root: {
    padding: '0.6em 0.5em 0.5em',
  },
  actions: {
    display: 'flex',
    marginTop: '0.55em',
    width: '9em',
    justifyContent: 'space-between',
    marginLeft: 'auto',
  },
})

export const ConfirmDeleteDialog = (p: {itemsCount: number, onConfirm: () => void, onCancel: () => void}) => {
  const classes = useConfirmDeleteDialogStyles()
  return (
      <div className={classes.root}>
        {p.itemsCount > 1 ?
          <Typography>Are you sure you want to delete these {p.itemsCount} records?</Typography> :
          <Typography>Are you sure you want to delete this record?</Typography>
        }
        <div className={classes.actions}>
          <Button size='small' onClick={p.onCancel} variant='outlined' color='secondary'>Cancel</Button>
          <Button size='small' onClick={p.onConfirm} variant='outlined' color='primary'>OK</Button>
        </div>
      </div>
  )
}