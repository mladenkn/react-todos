import { Todo } from "./shared"
import { FetchOf, AsyncOperationStatus, RequestStatus } from "../utils"
import { TodoEditorState } from "./todoEditor"
import { useImmer } from "use-immer";
import { useEffect } from "react"

// export type TodoDetailsLogic2 = {
//     type: 'FETCHING'
//     canStartEdit: false
//     canDelete: false
//     todoFetchStatus: 'NOT_INITIATED' | 'PROCESSING'
// } | {
//     type: 'FETCH_FAILED'
//     canStartEdit: false
//     canDelete: false
//     todoFetchStatus: 'FAILED'
// } | {
//     type: 'NORMAL'
//     canStartEdit: true
//     canDelete: true
//     todoFetchStatus: 'SUCCEEDED'
//     saveOperationStatus: 'SUCCEEDED' | 'FAILED'
//     todo: Todo
//     startEdit: () => void
//     delete: () => void
// } | {
//     type: 'EDITING'
//     canStartEdit: false
//     canDelete: false
//     todoFetchStatus: 'SUCCEEDED'
//     saveOperationStatus: 'NOT_INITIATED'
//     todo: Todo
//     finsihEdit: () => void
//     cancelEdit: () => void
// } | {
//     type: 'EDITING_SAVING'
//     canStartEdit: false
//     todoFetchStatus: 'SUCCEEDED'
//     saveOperationStatus: 'PROCESSING'
//     todo: Todo
// }

export type TodoEditingStatus = 'NOT_EDITING' | 'EDITING_NO_REQUEST' | 'EDITING_REQUEST_PENDING' | 'EDITING_REQUEST_SUCCEEDED' | 'EDITING_REQUEST_FAILED'

export interface TodoDetailsLogic {
    fetchTodo: () => void
    startEdit: () => void
    delete: () => void
    finishEdit: (todo: Todo) => void
    cancelEdit: () => void

    deletingStatus?: RequestStatus
    editingStatus?: 'EDITING' | RequestStatus

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

export const createTodoDetailsLogic = (
    initialState_: TodoDetailsState = todoDetailsinitialState,
    opt?: { noInitialFetch?: boolean }
): TodoDetailsLogic => {

    const [state, updateState] = useImmer<TodoDetailsState>(initialState_)

    if(!(opt && opt.noInitialFetch))
        useEffect(() => {
            fetchTodo()
        }, [])

    const fetchTodo = () => {
        updateState(s => {
            s.lastTodoFetch = { data: undefined, status: AsyncOperationStatus.Processing }
        })
        // ...
    }

    const saveTodo = (todo: Todo) => {
        updateState(s => {
            s.editingStatus = 'REQUEST_PENDING'
        })
        // ...
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
        // ....
    }

    const finishEdit = (todo: Todo) => {
        if(state.editingStatus !== 'EDITING')
            throw new Error()
        else 
            saveTodo(todo)
    }

    const cancelEdit = () => {
        if(state.editingStatus !== 'EDITING')
            throw new Error()
        else
            updateState(s => {
                s.editingStatus = undefined
            })
    }

    const todo = state.lastTodoChange || (state.lastTodoFetch && state.lastTodoFetch.data && state.lastTodoFetch.data!)

    return { 
        todo,
        editingStatus: state.editingStatus, 
        deletingStatus: state.deleteStatus, 
        startEdit, 
        delete: delete_, 
        finishEdit, 
        cancelEdit, 
        fetchTodo 
    }
}