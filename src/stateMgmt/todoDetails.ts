import {  TodoEditableProps } from "./shared"
import { FetchOf,  RequestStatus } from "../utils"
import { useImmer } from "use-immer";
import { Todo, TodoDataApi } from "../dataAccess/todoDataApi";

export interface TodoDetailsLogic {
    editingStatus?: 'EDITING' | RequestStatus
    todoFetchStatus?: RequestStatus
    lastDeleteStatus?: 'UNCONFIRMED' | 'CANCELED' | RequestStatus

    todo?: Todo

    fetchTodo: () => void
    startEdit: () => void
    finishEdit: (todo: TodoEditableProps) => void
    cancelEdit: () => void
    
    beginDelete: () => void
    confirmDelete: () => void
    cancelDelete: () => void
}

type TodoDetailsState = {
    lastTodoFetch?: FetchOf<Todo>,
    editingStatus?: 'EDITING' | RequestStatus,
    deleteStatus?: RequestStatus
    lastTodoChange?: Todo
    lastDeleteStatus?: 'UNCONFIRMED' | 'CANCELED' | RequestStatus
}

export const todoDetailsinitialState: TodoDetailsState = {
    lastTodoFetch: undefined,
    editingStatus: undefined,
    deleteStatus: undefined,
}

interface TodoDetailsProps {
    initialState?: TodoDetailsState,
    todoId: number,
    api: TodoDataApi
}

export const useTodoDetailsLogic = (p: TodoDetailsProps): TodoDetailsLogic => {

    const [state, updateState] = useImmer<TodoDetailsState>(p.initialState || todoDetailsinitialState)

    const fetchTodo = () => {
        updateState(s => {
            s.lastTodoFetch = { data: undefined, status: 'REQUEST_PENDING' }
        })
        p.api.fetch(p.todoId)
            .then(todo => {
                updateState(s => {
                    s.lastTodoFetch = { data: todo, status: 'REQUEST_SUCCEESS' }
                })
            })
            .catch(() => {
                updateState(s => {
                    s.lastTodoFetch = { data: undefined, status: 'REQUEST_FAILED' }
                })
            })
    }

    const saveTodo = (todo: Todo) => {
        updateState(s => {
            s.editingStatus = 'REQUEST_PENDING'
        })
        p.api.save(todo)
            .then(response => {
                updateState(s => {
                    s.lastTodoChange = response.todo
                    s.editingStatus = 'REQUEST_SUCCEESS'
                })
            })
            .catch(() => {
                updateState(s => {
                    s.editingStatus = 'REQUEST_FAILED'
                })
            })
    }
  
    const startEdit = () => {
        updateState(s => {
            s.editingStatus = 'EDITING'
        })
    }

    const beginDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastDeleteStatus = 'UNCONFIRMED'
        })
    }

    const confirmDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastDeleteStatus = 'REQUEST_PENDING';
        })
        p.api.delete([p.todoId])
            .then(() => {
                updateState(stateDraft => {
                    stateDraft.lastDeleteStatus = 'REQUEST_SUCCEESS'
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastDeleteStatus = 'REQUEST_FAILED'
                })
            })
    }

    const cancelDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastDeleteStatus = 'CANCELED'
        })
    }

    const todo = state.lastTodoChange || (state.lastTodoFetch && state.lastTodoFetch.data && state.lastTodoFetch.data!)
    const todoFetchStatus = state.lastTodoFetch && state.lastTodoFetch.status

    const finishEdit = (todoFormValues: TodoEditableProps) => {
        if(state.editingStatus !== 'EDITING')
            throw new Error()
        else 
            saveTodo({...todo!, ...todoFormValues})
    }

    const cancelEdit = () => {
        if(state.editingStatus !== 'EDITING')
            throw new Error()
        else
            updateState(s => {
                s.editingStatus = undefined
            })
    }

    return { 
        todo,
        todoFetchStatus,
        editingStatus: state.editingStatus,
        lastDeleteStatus: state.lastDeleteStatus,
        
        startEdit, 
        beginDelete, 
        confirmDelete,
        cancelDelete,
        finishEdit, 
        cancelEdit, 
        fetchTodo 
    }
}