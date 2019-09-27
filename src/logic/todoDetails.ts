import { Todo, TodoEditableProps } from "./shared"
import { FetchOf,  RequestStatus } from "../utils"
import { useImmer } from "use-immer";
import { TodoDataApi } from "./todoDataApi";

export interface TodoDetailsLogic {
    fetchTodo: () => void
    startEdit: () => void
    delete: () => void
    finishEdit: (todo: TodoEditableProps) => void
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
    onDelete: () => void
}

export const useTodoDetailsLogic = (p: TodoDetailsProps): TodoDetailsLogic => {

    const [state, updateState] = useImmer<TodoDetailsState>(p.initialState || todoDetailsinitialState)

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
        startEdit, 
        delete: delete_, 
        finishEdit, 
        cancelEdit, 
        fetchTodo 
    }
}