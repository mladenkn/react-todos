import { FetchOf } from "../utils";
import { Todo } from "./shared";

interface TodoListState {
    lastFetch?: FetchOf<Todo>
    changesSinceLastFetch: Record<string, Todo>
    selectedTodos: string[]
    sortByField?: keyof Todo
}

interface TodoList {
    list: FetchOf<Todo & {isSelected: boolean}>

    selectTodo: (todoId: string) => void
    sort: (todoField: keyof Todo) => void
    updateList: (todoId: string, todo: Todo) => void
}

export const createTodoListLogic = () => {

}