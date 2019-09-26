import { FetchOf, RequestStatus } from "../utils"
import { TodoListItem, TodoDataApi } from "./todoDataApi"

interface State {
    lastFetch: FetchOf<TodoListItem>
    changesSinceLastFetch: Record<number, TodoListItem | undefined>
    lastDelete?: {
        items: number[]
        status: 'UNCONFIRMED' | RequestStatus
    }
}

interface Props {
    initialState?: State
    api: TodoDataApi
    noInitialFetch?: boolean
}

export const useTodoListSectionLogic = (p: Props) => {
    
    const delete_ = (ids: number[]) => {

    }




    return { delete: delete_ }
}