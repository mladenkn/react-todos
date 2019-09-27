import { Todo } from "./shared";
import { PagedListSearchParams, PagedList } from "../utils";

export type TodoListItem = Omit<Todo, 'description'>

interface SaveResponse {
    todo: Todo, 
    list?: PagedList<Todo>
}

export interface TodoDataApi {
    fetchList: (p: PagedListSearchParams<Todo>) => Promise<PagedList<Todo>>
    fetch: (todoId: number) => Promise<Todo>
    save: (todo: Omit<Todo, 'id'>, listParams?: PagedListSearchParams<Todo>) => Promise<SaveResponse>
    delete: (todoIds: number[]) => Promise<any>
}

const resolvesAfter = <T> (milis: number, data?: T) => {
    return new Promise<T>(resolve => setTimeout(() => resolve(data), milis))    
}

const todoJsonReviver = (key: string, value: any) => {
    if (key === 'createdAt') 
        return new Date(value) 
    else if (key === 'id')
        return +value
    else
        return value;
}

const doesTodoMatchSearchQuery = (searchQuery?: string) => (todo: Todo) => {
    if(!searchQuery)
        return true
    if(todo.id === +searchQuery)
        return true
    if(todo.name.includes(searchQuery))
        return true
    if(todo.description.includes(searchQuery))
        return true
    else
        return false    
}

export const createTodoLocalStorageDataApi = (): TodoDataApi => {

    const getAllTodos = () => Object.entries(localStorage)
        .filter(([key, value]) => key.startsWith('todos/'))
        .map(([key, value]) => JSON.parse(value, todoJsonReviver) as Todo)
    
    let nextTodoId = getAllTodos().sort((a, b) => b.id - a.id)[0].id + 1

    const fetchList = (p: PagedListSearchParams<Todo>) => {     
        const pageStart = p.rowsPerPage * p.page
        const pageEnd = pageStart + p.rowsPerPage
        const allTodos = getAllTodos()

        const items = allTodos
            .sort((a, b) => {
                if (p.orderBy === 'createdAt' && p.order === 'desc')
                    return b.createdAt.getTime() - a.createdAt.getTime()
               
                else if (p.orderBy === 'createdAt' && p.order === 'asc')
                    return a.createdAt.getTime() - b.createdAt.getTime()
               
                else if (p.orderBy === 'name' && p.order === 'desc')
                    return b.name.localeCompare(a.name)
               
                else if (p.orderBy === 'name' && p.order === 'asc')
                    return a.name.localeCompare(b.name)
               
                else 
                    throw new Error()
            })
            .filter(doesTodoMatchSearchQuery(p.searchQuery))
            .slice(pageStart, pageEnd)

        return {
            data: items,
            totalCount: allTodos.length,
        }
    }

    const promiseReturningFetchList = (p: PagedListSearchParams<Todo>) => resolvesAfter(500, fetchList(p))

    const fetch = (todoId: number) => {
        const todo = localStorage.getItem(`todos/${todoId}`)!
        return resolvesAfter<Todo>(500, JSON.parse(todo, todoJsonReviver)) // simulating slow fetch
    }

    const save = (todo: Omit<Todo, 'id'>, listParams?: PagedListSearchParams<Todo>) => {
        const withId = { ...todo, id: nextTodoId }
        nextTodoId++
        localStorage.setItem(`todos/${withId.id}`, JSON.stringify(withId))
        const response = {
            todo: withId,
            list: listParams && fetchList(listParams!)
        }
        return resolvesAfter<SaveResponse>(300, response)
    }

    const delete_ = (todoIds: number[]) => {
        for (const id of todoIds) 
            localStorage.removeItem(`todos/${id}`)
        return resolvesAfter(500);
    }

    return { fetchList: promiseReturningFetchList, fetch, save, delete: delete_ }
}