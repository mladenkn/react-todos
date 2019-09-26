import { FetchOf, RequestStatus, PagedListSearchParams, PagedList } from "../utils"
import { TodoListItem, TodoDataApi } from "./todoDataApi"
import { useImmer } from "use-immer"
import { Todo } from "./shared"
import { useEffect } from "react"

interface State {
    lastFetch?: FetchOf<PagedList<Todo>>
    searchParams: PagedListSearchParams<Todo>
    changesSinceLastFetch: {
        deleted: number[]
        new: Todo[]
        updated: Record<number, Todo>
    }
    lastDelete?: {
        items: number[]
        status: 'UNCONFIRMED' | RequestStatus
    }
    lastEdit?: {
        itemId: number
        status: 'USER_EDITING' | RequestStatus
    }
    lastCreate?: {
        status: 'USER_CREATING' | RequestStatus
    }
}

interface Props {
    api: TodoDataApi
    initialState?: State
    noInitialFetch?: boolean
}

const zeroState: State = {
    lastFetch: undefined,
    searchParams: {
        order: 'desc',
        orderBy: 'createdAt',
        page: 0,
        rowsPerPage: 7,   
    },
    changesSinceLastFetch: {
        deleted: [],
        new: [],
        updated: {}
    },
    lastDelete: undefined
}

export const useTodoListSectionLogic = (p: Props) => {

    const [state, updateState] = useImmer<State>(p.initialState || zeroState)

    useEffect(() => {
        if(!p.noInitialFetch)
            fetchList()
    })
    
    const delete_ = (ids: number[]) => updateState(stateDraft => {
        stateDraft.lastDelete = { items: ids, status: 'UNCONFIRMED' }
    })

    const confirmDelete = () => {
        updateState(stateDraft => {
            stateDraft.lastDelete!.status = 'REQUEST_PENDING';
        })
        p.api.delete(state.lastDelete!.items)
            .then(() => {
                updateState(stateDraft => {
                    stateDraft.lastDelete!.status = 'REQUEST_SUCCEESS'
                    stateDraft.lastDelete!.items.forEach(todoId => {
                        stateDraft.changesSinceLastFetch.deleted.push(todoId)
                    })
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastDelete!.status = 'REQUEST_FAILED'
                })
            })
    }

    const fetchList = () => {
        updateState(stateDraft => {
            stateDraft.lastFetch = { data: undefined, status: 'REQUEST_PENDING' }
        })
        p.api.fetchList(state.searchParams)
            .then(response => {
                updateState(stateDraft => {
                    stateDraft.lastFetch = {
                        data: response,
                        status: 'REQUEST_SUCCEESS'
                    }
                    stateDraft.changesSinceLastFetch = zeroState.changesSinceLastFetch
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastFetch!.status = 'REQUEST_FAILED'
                })
            })
    }

    const beginEdit = (todoId: number) => {
        updateState(stateDraft => {
            stateDraft.lastEdit = {
                itemId: todoId,
                status: 'USER_EDITING',
            }
        })
    }

    const finishEdit = (todo: Omit<Todo, 'id'>) => {
        updateState(stateDraft => {
            stateDraft.lastEdit!.status = 'REQUEST_PENDING'
        })
        const todoWithId = { ...todo, id: state.lastEdit!.itemId }
        p.api.save(todoWithId)
            .then(updatedTodo => {
                updateState(stateDraft => {
                    stateDraft.lastEdit!.status = 'REQUEST_SUCCEESS'
                    stateDraft.changesSinceLastFetch.updated[updatedTodo.id] = updatedTodo
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastEdit!.status = 'REQUEST_FAILED'
                })                
            })
    }

    const beginCreate = () => {
        updateState(stateDraft => {
            stateDraft.lastCreate = { status: 'USER_CREATING' }
        })
    }

    const finsihCreate = (newTodo: Todo) => {
        updateState(stateDraft => {
            stateDraft.lastCreate!.status = 'REQUEST_PENDING'
        })
        p.api.save(newTodo)
            .then(newTodoFromServer => {
                updateState(stateDraft => {
                    stateDraft.lastCreate!.status = 'REQUEST_SUCCEESS'
                    stateDraft.changesSinceLastFetch.new.push(newTodoFromServer)
                })
            })
            .catch(() => {
                updateState(stateDraft => {
                    stateDraft.lastCreate!.status = 'REQUEST_FAILED'
                })                
            })
    }
    
    const setSearchParams = (params: PagedListSearchParams<Todo>) => updateState(stateDraft => {
        stateDraft.searchParams = params
    })


    const getCurrentTodos = () => {
        const withoutNewOnes = state.lastFetch!.data!.data
            .filter(todo => !state.changesSinceLastFetch.deleted.includes(todo.id))
            .map(todo => {
                const changedTodo = state.changesSinceLastFetch.updated[todo.id]
                if(changedTodo !== undefined)
                    return changedTodo
                else
                    return todo
            })
        
        return [...withoutNewOnes, ...state.changesSinceLastFetch.new]
    }

    const todos = {
        data: getCurrentTodos(),
        totalCount: state.lastFetch!.data!.totalCount + state.changesSinceLastFetch.new.length,
        loadStatus: state.lastFetch!.status
    }

    return { 
        setSearchParams,
        todoListSearchParams: state.searchParams, 
        delete: delete_, 
        confirmDelete, 
        fetchList, 
        todos, 
        beginEdit, 
        finishEdit,
        beginCreate,
        finsihCreate,
    }
}