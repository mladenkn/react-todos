import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { TodoTable } from './TodoTable'
import { TodoListItem, TodoDataApi } from '../logic/todoDataApi';
import { useTodoListSectionLogic } from '../logic/todoListSection';
import { RequestStatus, PagedListSearchParams } from '../utils';
import { Dialog } from '@material-ui/core';
import { TodoEditor } from './TodoEditor';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

const useStyles = makeStyles({
  root: {
    padding: '1.5em'
  },
  todoEditor: {
    padding: '1em',
    width: '30em',
  },
})

const initalSearchParams: PagedListSearchParams<TodoListItem> = {
  order: 'desc',
  orderBy: 'createdAt',
  page: 0,
  rowsPerPage: 6,   
}

export const TodoListPage = (p: {api: TodoDataApi}) => {

  const classes = useStyles()
  const logic = useTodoListSectionLogic({api: p.api})
  useEffect(() => {
    logic.fetchList(initalSearchParams)
  }, [])

  console.log(logic)

  const lastSearchParams = (logic.todoListSearchParams || initalSearchParams) as any
  const fetchStatus: RequestStatus = logic.todos.loadStatus ? logic.todos.loadStatus : 'REQUEST_PENDING'

  return (
    <div className={classes.root}>
      <TodoTable 
        todos={{
          data: logic.todos.data,
          fetchStatus: fetchStatus,
          totalCount: logic.todos.totalCount
        }}
        lastSearchParams={lastSearchParams}
        onSearchParamsChange={logic.fetchList}
        onDeleteClick={logic.delete}
        onDeleteSelectedClick={logic.deleteSelected}
        onEditClick={logic.beginEdit}
        toggleItemSelect={logic.toggleTodoSelect}
        toggleAllSelect={logic.toggleSelectAll}
        onTodoAddClick={logic.beginCreate}
      />
      {logic.isEditing &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            todoInitial={logic.lastEdit!.todo!}
            onCancel={logic.cancelEdit}
            onSubmit={logic.finishEdit}
          />
        </Dialog>
      }
      {logic.isCreating &&
        <Dialog open={true} onClose={logic.cancelEdit}>
          <TodoEditor 
            className={classes.todoEditor}
            onCancel={logic.cancelCreate}
            onSubmit={logic.finishCreate}
          />
        </Dialog>
      }
      {logic.shouldConfirmDelete && 
        <Dialog open={true} onClose={logic.cancelDelete}>
          <ConfirmDeleteDialog 
            itemsCount={logic.selectedItems.length}
            onConfirm={logic.confirmDelete} 
            onCancel={logic.cancelDelete} 
          />
        </Dialog>
      }
    </div>
  )
}