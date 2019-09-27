import { Todo } from "./shared";
import { PagedListSearchParams, PagedList } from "../utils";

export type TodoListItem = Omit<Todo, 'description'>

export interface TodoDataApi {
    fetchList: (p: PagedListSearchParams<Todo>) => Promise<PagedList<Todo>>
    fetch: (todoId: number) => Promise<Todo>
    save: (todo: Omit<Todo, 'id'>) => Promise<Todo>
    delete: (todoIds: number[]) => Promise<any>
}

const resolvesAfter = <T> (milis: number, data?: T) => {
    return new Promise<T>(resolve => setTimeout(() => resolve(data), milis))    
}

const todoJsonReviver = (key: string, value: any) => 
    key === 'createdAt' ? new Date(value) : value

export const createTodoLocalStorageDataApi = (): TodoDataApi => {

    const fetchList = (p: PagedListSearchParams<Todo>) => {
        const entries = Object.entries(localStorage)            
        const pageStart = p.rowsPerPage * p.page
        const pageEnd = pageStart + p.rowsPerPage

        const items = entries
            .filter(([key, value]) => key.startsWith('todos/'))
            .map(([key, value]) => JSON.parse(value, todoJsonReviver) as Todo)
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
            .slice(pageStart, pageEnd)

        const r = {
            data: items,
            totalCount: entries.length,
        }

        return resolvesAfter(300, r)
    }

    const fetch = (todoId: number) => {
        const todo = localStorage.getItem(`todos/${todoId}`)!
        return resolvesAfter<Todo>(500, JSON.parse(todo, todoJsonReviver)) // simulating slow fetch
    }

    const save = (todo: Omit<Todo, 'id'>) => {
        localStorage.setItem(`todos/${(todo as any).id}`, JSON.stringify(todo))
        return resolvesAfter<Todo>(500, todo as any)
    }

    const delete_ = (todoIds: number[]) => {
        for (const id of todoIds) 
            localStorage.removeItem(`todos/${id}`)
        return resolvesAfter(500);
    }

    return { fetchList, fetch, save, delete: delete_ }
} 

// function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }

// function desc<T>(a: T, b: T, orderBy: keyof T) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getSorting<K extends keyof any>(
//   order: 'asc' | 'desc',
//   orderBy: K,
// ): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
//   return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
// }