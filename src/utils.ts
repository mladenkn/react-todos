import faker from 'faker'

export enum AsyncOperationStatus {
    Processing='Processing', Succeeded='Succeeded', Failed='Failed'
}

export interface FetchOf<TData> {
    data?: TData
    // status: 'NOT_INITIATED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED'
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