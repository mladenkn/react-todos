import { Todo } from "./shared"
import { FetchOf } from "../utils"
import { TodoEditorState, TodoEditor } from "./todoEditor"

type TodoDetailsSectionState = {
    deleting: boolean
    lastFetch: FetchOf<Todo>
    changeSinceLastFetch: Todo
    editor: TodoEditorState
} | {
    deleted: true
}

export type TodoDetailsLogic = {
    type: 'FETCHING'
    todoFetchStatus: 'NOT_INITIATED' | 'PROCESSING'
} | {
    type: 'FETCH_FAILED'
    todoFetchStatus: 'FAILED'
} | {
    type: 'NORMAL'
    todoFetchStatus: 'SUCCEEDED'
    saveOperationStatus: 'SUCCEEDED' | 'FAILED'
    todo: Todo
    startEdit: () => void
} | {
    type: 'EDITING'
    todoFetchStatus: 'SUCCEEDED'
    saveOperationStatus: 'NOT_INITIATED'
    todo: Todo
    finsihEdit: () => void
    cancelEdit: () => void
} | {
    type: 'EDITING_SAVING'
    todoFetchStatus: 'SUCCEEDED'
    saveOperationStatus: 'PROCESSING'
    todo: Todo
}

export const createTodoDetailsSection = () => {

}