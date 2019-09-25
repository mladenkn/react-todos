import faker from 'faker'
import { generateArray } from '../utils'

let nextTodoId: number = 1
const generateTodo = () => {
    const todo = {
        id: nextTodoId++,
        name: faker.lorem.word(),
        description: faker.lorem.paragraph(),
        createdAt: faker.date.past()
    }   
    return todo
}

const areTodosSaved = () => Object.keys(localStorage).some(k => k.startsWith('todos/'))

export const ensureTodosAreSaved = () => {    
    if(areTodosSaved())
        return
    const todos = generateArray(generateTodo, 30, 40)
    for (const todo of todos) 
        localStorage.setItem(`todos/${todo.id}`, JSON.stringify(todo))
}