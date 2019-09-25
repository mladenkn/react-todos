import { Todo } from "./shared";

export interface TodoDataApi {
    fetch: (todoId: string) => Promise<Todo>
    save: (todo: Todo) => Promise<Todo>
    delete: (todoId: string) => Promise<any>
}

const resolvesAfter = <T> (milis: number, data?: T) => {
    return new Promise<T>(resolve => setTimeout(() => resolve(data), milis))    
}

export const createTodoLocalStorageDataApi = (): TodoDataApi => {

    const fetch = (todoId: string) => {
        const todo = localStorage.getItem(`todos/${todoId}`)!
        console.log(JSON.parse(todo))
        return resolvesAfter<Todo>(500, JSON.parse(todo)) // simulating slow fetch
    }

    const save = (todo: Todo) => {
        localStorage.setItem(`todos/${todo.id}`, JSON.stringify(todo))
        return resolvesAfter<Todo>(500, todo)
    }

    const delete_ = (todoId: string) => {
        localStorage.removeItem(`todos/${todoId}`)
        return resolvesAfter(500);
    }

    return { fetch, save, delete: delete_ }
} 