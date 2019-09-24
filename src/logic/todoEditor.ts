import { Todo } from "./shared";
import { AsyncOperationStatus } from "../utils";

export interface TodoEditorState {
    props: Omit<Todo, 'id'>
    id?: string
    lastSaveOperation: AsyncOperationStatus
}

export interface TodoEditor {
    props: Omit<Todo, 'id'>
    lastSaveOperation: AsyncOperationStatus

    setProps: (props: Omit<Todo, 'id'>) => void
    finish: () => Todo
    cancel: () => void
    onFinish: (cb: (todo: Todo) => void) => void
}