export enum AsyncOperationStatus {
    Processing='Processing', Succeeded='Succeeded', Failed='Failed'
}

export interface FetchOf<TData> {
    data?: TData
    // status: 'NOT_INITIATED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED'
    status: RequestStatus
}

export type RequestStatus = 'REQUEST_PENDING' | 'REQUEST_SUCCEESS' | 'REQUEST_FAILED'