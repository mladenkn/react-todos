export interface Todo {
    id: number
    name: string
    description: string
    createdAt: Date
}

export interface TodoEditableProps {
    name: string
    description: string
}