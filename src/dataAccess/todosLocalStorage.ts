import { PagedList, PagedListSearchParams } from "../utils";
import { Optional } from "utility-types";
import { Todo } from "./todoDataApi";

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

export const createTodoLocalStorage = () => {

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

    const fetch = (todoId: number) => {
        const todo = localStorage.getItem(`todos/${todoId}`)!
        return JSON.parse(todo, todoJsonReviver)
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
        return response
    }

    const delete_ = (todoIds: number[], listParams?: PagedListSearchParams<Todo>) => {
        for (const id of todoIds) 
            localStorage.removeItem(`todos/${id}`)
        return listParams || {}
    }

    return { fetchList, fetch, save, delete: delete_ }
}