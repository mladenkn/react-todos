import { Todo } from "./shared";
import { PagedList, PagedListSearchParams, RequestStatus } from "../utils";
import { useState } from "react";

interface Data {
    todo: Todo
    list?: PagedList<Todo>
}

interface State {
    data?: Data
    status: 'NO_REQUEST' | RequestStatus
}

type Post = (todo: Todo, p: PagedListSearchParams<Todo>) => Promise<Data>

export const useTodoPostEffect = (post: Post) => {

    const [state, setState] = useState<State>({
        status: 'NO_REQUEST'   
    })

    const act = (todo: Todo, p: PagedListSearchParams<Todo>) => {
        setState({ status: 'REQUEST_PENDING' })
        post(todo, p)
            .then(response => {
                setState({ status: 'REQUEST_SUCCEESS', data: response })
            })
            .catch(() => {
                setState({ status: 'REQUEST_FAILED' })
            })
    }

    return { state, act }
}