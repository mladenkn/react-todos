import { PagedList, PagedListSearchParams } from "../utils"
import { createTodoLocalStorage } from "./todosLocalStorage"

interface SaveResponse {
    todo: Todo, 
    list?: PagedList<Todo>
}

export interface Todo {
    id: number
    name: string
    description: string
    createdAt: Date
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

export const createTodoLocalStorageDataApi = (): TodoDataApi => {
    const storage = createTodoLocalStorage()

    const fetchList = (p: PagedListSearchParams<Todo>) => resolvesAfter(300, storage.fetchList(p))
    
    const fetch = (todoId: number) => resolvesAfter(100, storage.fetch(todoId)) // simulating REST API with delay
    
    const save = (todo: Omit<Todo, 'id'>, listParams?: PagedListSearchParams<Todo>) => 
        resolvesAfter(300, storage.save(todo, listParams))
    
    const delete_ = (todoIds: number[], listParams?: PagedListSearchParams<Todo>) => 
        resolvesAfter(300, storage.delete(todoIds, listParams))

    return { fetchList, fetch, save, delete: delete_ }
}