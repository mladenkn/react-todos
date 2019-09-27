import { makeStyles } from "@material-ui/styles"
import React from "react"
import { Typography, Button } from "@material-ui/core"

const useConfirmDeleteDialogStyles = makeStyles({
  root: {
    padding: '0.5em',
    width: '9.5em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
    marginTop: '1em',
    width: '100%',
    justifyContent: 'space-between',
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