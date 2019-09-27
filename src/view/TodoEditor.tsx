import React from 'react'
import { Typography, makeStyles, TextField, Button } from "@material-ui/core"
import { TodoEditableProps } from '../logic/shared'
import { Formik, Form, Field, FormikErrors } from 'formik';
import clsx from 'clsx'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    marginTop: '2em',
  },
  buttons: {
    marginTop: '2em',
    marginLeft: 'auto',    
  },
  submitButton: {
    marginLeft: '1em',
  },
  fieldError: {
    marginTop: '0.3em',
  },
})

interface Props {
  className?: string
  todoInitial?: TodoEditableProps
  onCancel: () => void
  onSubmit: (todo: TodoEditableProps) => void
}

export const TodoEditor = (p: Props) => {
  const classes = useStyles()

  const validate = (values: TodoEditableProps) => {
    let errors: FormikErrors<TodoEditableProps> = {}
    if(values.name === '')
      errors.name = 'Name is required'
    if(values.description === '')
      errors.description = 'Description is required'
    return errors
  }

  const onSubmit = (values: TodoEditableProps) => {
    p.onSubmit(values as TodoEditableProps)
  }

  const initialValues = p.todoInitial || { name: '', description: '' }

  return (
    <Formik onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {({ errors, touched }) =>
        <Form className={clsx(classes.root, p.className)}>          
         
          <Field name='name'>
            {({ field }: any) =>
              <TextField label='Name' {...field} />
            }
          </Field>
          {touched.name && errors.name && 
            <Typography color='secondary' className={classes.fieldError}>{errors.name}</Typography>}
         
          <Field name='description'>
            {({ field }: any) =>
              <TextField className={classes.description} multiline label='Description' {...field} />
            }
          </Field>
          {touched.description && errors.description && 
            <Typography color='secondary' className={classes.fieldError}>{errors.description}</Typography>
          }
         
          <div className={classes.buttons}>
            <Button onClick={p.onCancel} color='secondary' variant='outlined'>Cancel</Button>
            <Button type='submit' className={classes.submitButton} color='primary' variant='outlined'>Submit</Button>
          </div>
        </Form>
      }
    </Formik>
  )
}