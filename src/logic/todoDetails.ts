import { Todo } from "./shared"
import { FetchOf,  RequestStatus } from "../utils"
import { useImmer } from "use-immer";
import { useEffect } from "react"
import { TodoDataApi } from "./todoDataApi";
import { TodoFormValues } from "../view/TodoEditor";

export interface TodoDetailsLogic {
    fetchTodo: () => void
    startEdit: () => void
    delete: () => void
    finishEdit: (todo: TodoFormValues) => void
    cancelEdit: () => void

    editingStatus?: 'EDITING' | RequestStatus
    todoFetchStatus?: RequestStatus

    todo?: Todo
}

type TodoDetailsState = {
    lastTodoFetch?: FetchOf<Todo>,
    editingStatus?: 'EDITING' | RequestStatus,
    deleteStatus?: RequestStatus
    lastTodoChange?: Todo
}

export const todoDetailsinitialState: TodoDetailsState = {
    lastTodoFetch: undefined,
    editingStatus: undefined,
    deleteStatus: undefined,
}

interface TodoDetailsProps {
    initialState?: TodoDetailsState,
    todoId: number,
    todoApi: TodoDataApi,
    noInitialFetch?: boolean
    onDelete: () => void
}

export const useTodoDetailsLogic = (p: TodoDetailsProps): TodoDetailsLogic => {

    const [state, updateState] = useImmer<TodoDetailsState>(p.initialState || todoDetailsinitialState)

    useEffect(() => {
        if(!p.noInitialFetch)
            fetchTodo()
    }, [])

    const fetchTodo = () => {
        updateState(s => {
            s.lastTodoFetch = { data: undefined, status: 'REQUEST_PENDING' }
        })
        p.todoApi.fetch(p.todoId)
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
        p.todoApi.save(todo)
            .then(updatedTodo => {
                updateState(s => {
                    s.lastTodoChange = updatedTodo
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

    const delete_ = () => {
        updateState(s => {
            s.deleteStatus = 'REQUEST_PENDING'
        })
        p.todoApi.delete([p.todoId])
            .then(() => {
                updateState(s => {
                    s.deleteStatus = 'REQUEST_SUCCEESS'
                    p.onDelete()
                })
            })
            .catch(() => {
                updateState(s => {
                    s.deleteStatus = 'REQUEST_FAILED'
                })
            })
    }

    const todo = state.lastTodoChange || (state.lastTodoFetch && state.lastTodoFetch.data && state.lastTodoFetch.data!)
    const todoFetchStatus = state.lastTodoFetch && state.lastTodoFetch.status

    const finishEdit = (todoFormValues: TodoFormValues) => {
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
        startEdit, 
        delete: delete_, 
        finishEdit, 
        cancelEdit, 
        fetchTodo 
    }
}