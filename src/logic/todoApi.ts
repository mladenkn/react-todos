import { Todo } from "./shared";
import faker from 'faker'

export interface TodoApi {
    fetch: (todoId: string) => Promise<Todo>
    save: (todo: Todo) => Promise<Todo>
    delete: (todoId: string) => Promise<any>
}

const resolvesAfter = <T> (milis: number, data?: T) => {
    return new Promise<T>(resolve => setTimeout(() => resolve(data), milis))    
}

let nextTodoId: number = 1

export const createTodoApi = (): TodoApi => {
    const fetch = (todoId: string) => {
        const todo = {
            id: nextTodoId.toString(),
            name: faker.lorem.word(),
            description: faker.lorem.paragraph(),
            createdAt: faker.date.past()
        }
        nextTodoId++
        return resolvesAfter<Todo>(500, todo)
    }

    const save = (todo: Todo) => resolvesAfter<Todo>(500, todo)

    const delete_ = (todoId: string) => resolvesAfter(500)

    return { fetch, save, delete: delete_ }
}