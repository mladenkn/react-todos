import faker from 'faker'

export enum AsyncOperationStatus {
    Processing='Processing', Succeeded='Succeeded', Failed='Failed'
}

export interface FetchOf<TData> {
    data?: TData
    status: RequestStatus
}

export type RequestStatus = 'REQUEST_PENDING' | 'REQUEST_SUCCEESS' | 'REQUEST_FAILED'

export const generateArray = <T> (getNext: () => T, minCount: number, maxCount: number) => {
    const count = faker.random.number({min: minCount, max: maxCount});
    const r: T[] = [];
    for (let i = 0; i < count; i++) 
        r.push(getNext());
    return r;
}

export interface PagedListSearchParams<T> {
    order: 'asc' | 'desc'
    orderBy: keyof T
    page: number
    rowsPerPage: number
}

export interface PagedList<T> {
    data: T[]
    totalCount: number
}