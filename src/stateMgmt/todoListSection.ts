import { FetchOf, RequestStatus, PagedListSearchParams, PagedList } from "../utils"
import { useImmer } from "use-immer"
import { TodoEditableProps } from "./shared"
import { debounce } from 'ts-debounce'
import { Todo, TodoDataApi } from "../dataAccess/todoDataApi"

interface State {
    lastFetch?: FetchOf<PagedList<Todo>>
    searchParams?: PagedListSearchParams<Todo>
    selectedItems: number[]
    lastDelete?: {
        status: 'UNCONFIRMED' | 'CANCELED' | RequestStatus
    }
    lastEdit?: {
        itemId: number
        status: 'USER_EDITING' | 'CANCELED'  | RequestStatus
    }
    lastCreate?: {
        status: 'USER_CREATING' | 'CANCELED' | RequestStatus
    }
}

interface Props {
    api: TodoDataApi
    debounceFetchBy?: number
    initialState?: State
}

const zeroState: State = {
    selectedItems: [],
}

export const useTodoListSectionLogic = (p: Props) => {

    const [state, updateState] = useImmer<State>(p.initialState || zeroState)
    console.log(state)

    const getCurrentTodos = () => {
        if(!state.lastFetch || !state.lastFetch.data)
            return undefined
        return state.lastFetch!.data!.data
            .map(t => {
                const isSelected = state.selectedItems.includes(t.id)
                return { ...t, isSelected }
            })
    }

    const totalCount = (state.lastFetch && state.lastFetch!.data) && state.lastFetch!.data!.totalCount

    const todos = {
        data: getCurrentTodos(),
        totalCount,
        loadStatus: state.lastFetch && state.lastFetch!.status
    }

    const lastEdit = state.lastEdit && state.lastFetch && (state.lastFetch.status === 'REQUEST_SUCCEESS') ? {
        ...state.lastEdit,
        todo: todos.data!.find(t => t.id === state.lastEdit!.itemId)
    }
    : undefined
    
    const isEditing = lastEdit && (lastEdit.status === "USER_EDITING")
    const isCreating = state.lastCreate && (state.lastCreate.status === "USER_CREATING")
    const shouldConfirmDelete = state.lastDelete && (state.lastDelete.status === 'UNCONFIRMED')


    
    const delete_ = (id: number) => {
        const isSelected = state.selectedItems.includes(id)
        updateState(stateDraft => {
            if(!isSelected)
                stateDraft.selectedItems.push(id)
            stateDraft.lastDelete = { status: 'UNCONFIRMED' };
        })
    }

    const deleteSelected = () => {
        updateState(stateDraft => {
            stateDraft.lastDelete = { status: 'UNCONFIRMED' };
        })
    }

    const confirmDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastFetch = { data: undefined, status: 'REQUEST_PENDING' }
            stateDraft.lastDelete!.status = 'REQUEST_PENDING';
        })
        p.api.delete(state.selectedItems, state.searchParams)
            .then(response => {
                updateState(stateDraft => {
                    stateDraft.lastDelete!.status = 'REQUEST_SUCCEESS'
                    stateDraft.lastFetch = {
                        data: response.list!,
                        status: 'REQUEST_SUCCEESS',
                    }
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastFetch!.status = 'REQUEST_FAILED'
                    stateDraft.lastDelete!.status = 'REQUEST_FAILED'
                })
            })
    }

    const cancelDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastDelete!.status = 'CANCELED'
        })
    }

    const debouncedFetch = debounce((params: PagedListSearchParams<Todo>) => {     
        updateState(stateDraft => {
            stateDraft.lastFetch = { data: undefined, status: 'REQUEST_PENDING' }
        })   
        p.api.fetchList(params)
            .then(response => {
                updateState(stateDraft => {
                    stateDraft.lastFetch = {
                        data: response,
                        status: 'REQUEST_SUCCEESS'
                    }
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastFetch!.status = 'REQUEST_FAILED'
                })
            })
    }, p.debounceFetchBy || 500)

    const fetchList = (params: PagedListSearchParams<Todo>) => {
        updateState(stateDraft => {
            stateDraft.searchParams = params
        })
        debouncedFetch(params)
    }

    const beginEdit = (todoId: number) => {
        updateState(stateDraft => {
            stateDraft.lastEdit = {
                itemId: todoId,
                status: 'USER_EDITING',
            }
        })
    }

    const finishEdit = (editedTodo: TodoEditableProps) => {
        updateState(stateDraft => {
            stateDraft.lastFetch = { data: undefined, status: 'REQUEST_PENDING' }
            stateDraft.lastEdit!.status = 'REQUEST_PENDING'
        })
        const todoWithId = { ...lastEdit!.todo!, ...editedTodo }
        p.api.save(todoWithId, state.searchParams)
            .then(response => {
                updateState(stateDraft => {
                    stateDraft.lastEdit!.status = 'REQUEST_SUCCEESS'
                    stateDraft.lastFetch = {
                        data: response.list!,
                        status: 'REQUEST_SUCCEESS'
                    }
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastFetch!.status = 'REQUEST_FAILED'
                    stateDraft.lastEdit!.status = 'REQUEST_FAILED'
                })                
            })
    }

    const cancelEdit = () => {
        updateState(stateDraft => {
            stateDraft.lastEdit!.status = 'CANCELED'
        })
    }

    const beginCreate = () => {
        updateState(stateDraft => {
            stateDraft.lastCreate = { status: 'USER_CREATING' }
        })
    }

    const finishCreate = (newTodoProps: TodoEditableProps) => {
        updateState(stateDraft => {
            stateDraft.lastFetch = { data: undefined, status: 'REQUEST_PENDING' }
            stateDraft.lastCreate!.status = 'REQUEST_PENDING'
        })
        const fullTodo = { ...newTodoProps, createdAt: new Date() }
        p.api.save(fullTodo, state.searchParams)
            .then(response => {
                updateState(stateDraft => {
                    stateDraft.lastCreate!.status = 'REQUEST_SUCCEESS'
                    stateDraft.lastFetch = {
                        data: response.list,
                        status: 'REQUEST_SUCCEESS',
                    }
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastFetch!.status = 'REQUEST_FAILED'
                    stateDraft.lastCreate!.status = 'REQUEST_FAILED'
                })                
            })
    }

    const cancelCreate = () => {
        updateState(stateDraft => {
            stateDraft.lastCreate!.status = 'CANCELED'
        })
    }

    const toggleTodoSelect = (todoId: number) => {        
        updateState(stateDraft => {
            if(stateDraft.selectedItems.includes(todoId))
                stateDraft.selectedItems = stateDraft.selectedItems.filter(id => id !== todoId)
            else
                stateDraft.selectedItems.push(todoId)
        })
    }

    const toggleSelectAll = () => {
        updateState(stateDraft => {
            if(stateDraft.selectedItems.length === 0)
                stateDraft.selectedItems = todos.data!.map(t => t.id)
            else
                stateDraft.selectedItems = []
        })
    }

    return { 
        todos, 
        lastDelete: state.lastDelete,
        deleteSelected,
        lastEdit,
        lastCreate: state.lastCreate,
        todoListSearchParams: state.searchParams, 
        isEditing,
        isCreating,
        shouldConfirmDelete,
        selectedItems: state.selectedItems,

        toggleSelectAll,
        toggleTodoSelect,
        cancelCreate,
        cancelEdit,
        cancelDelete,
        delete: delete_, 
        confirmDelete, 
        fetchList, 
        beginEdit, 
        finishEdit,
        beginCreate,
        finishCreate,
    }
}