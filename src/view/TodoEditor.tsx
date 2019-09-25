import React from 'react'
import { makeStyles, TextField, Button } from "@material-ui/core"
import { Todo } from '../logic/shared'
import { RequestStatus } from '../utils'
import { Formik, FormikActions, FormikProps, Form, Field, FieldProps } from 'formik';
import clsx from 'clsx'
import { Optional } from 'utility-types';


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
})

export interface TodoFormValues {
  name: string
  description: string
}

interface Props {
  className?: string
  todoInitial: Optional<TodoFormValues>
  onCancel: () => void
  onSubmit: (todo: TodoFormValues) => void
  status: 'EDITING' | RequestStatus
}

export const TodoEditor = (p: Props) => {
  const classes = useStyles()

  const validate = (values: Optional<TodoFormValues>) => {
    
  }

  const onSubmit = (values: Optional<TodoFormValues>) => {
    p.onSubmit(values as TodoFormValues)
  }

  return (
    <Formik onSubmit={onSubmit} validate={validate} initialValues={p.todoInitial}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) =>
        <Form className={clsx(classes.root, p.className)}>          
          <Field name='name'>
            {({ field }: any) =>
              <TextField label='Name' {...field} />
            }
          </Field>
          <TextField 
            className={classes.description}
            multiline
            name='description'
            label='Description'
            value={values.description}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <div className={classes.buttons}>
            <Button onClick={p.onCancel} color='secondary' variant='outlined'>Cancel</Button>
            <Button type='submit' className={classes.submitButton} color='primary' variant='outlined'>Submit</Button>
          </div>
        </Form>
      }
    </Formik>
  )
}