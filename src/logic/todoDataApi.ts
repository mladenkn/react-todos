import { Todo } from "./shared";
import { PagedListSearchParams, PagedList } from "../utils";
import { Optional } from "utility-types";

export type TodoListItem = Omit<Todo, 'description'>

interface SaveResponse {
    todo: Todo, 
    list?: PagedList<Todo>
}

export interface TodoDataApi {
    fetchList: (p: PagedListSearchParams<Todo>) => Promise<PagedList<Todo>>
    fetch: (todoId: number) => Promise<Todo>
    save: (todo: Omit<Todo, 'id'>, listParams?: PagedListSearchParams<Todo>) => Promise<SaveResponse>
    delete: (todoIds: number[], listParams?: PagedListSearchParams<Todo>) => Promise<{list?: PagedList<Todo>}>
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

        const allThatMatch = allTodos
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

        const data = allThatMatch.slice(pageStart, pageEnd)
            
        return { data, totalCount: allThatMatch.length }
    }

    const promiseReturningFetchList = (p: PagedListSearchParams<Todo>) => resolvesAfter(500, fetchList(p))

    const fetch = (todoId: number) => {
        const todo = localStorage.getItem(`todos/${todoId}`)!
        return resolvesAfter<Todo>(500, JSON.parse(todo, todoJsonReviver)) // simulating slow fetch
    }

    const save = (todo: Optional<Todo, 'id'>, listParams?: PagedListSearchParams<Todo>) => {
        let todoReadyToSave: Todo
        if(todo.id)
            todoReadyToSave = todo as Todo
        else {
            todoReadyToSave = { ...todo, id: nextTodoId }
            nextTodoId++
        }
        localStorage.setItem(`todos/${todoReadyToSave.id}`, JSON.stringify(todoReadyToSave))
        const response = {
            todo: todoReadyToSave,
            list: listParams && fetchList(listParams!)
        }
        return resolvesAfter<SaveResponse>(300, response)
    }

    const delete_ = (todoIds: number[], listParams?: PagedListSearchParams<Todo>) => {
        for (const id of todoIds) 
            localStorage.removeItem(`todos/${id}`)
        return listParams ? 
            resolvesAfter(500, {list: fetchList(listParams!)}) :
            resolvesAfter(500, {})
    }

    return { fetchList: promiseReturningFetchList, fetch, save, delete: delete_ }
}