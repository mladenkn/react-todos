export enum AsyncOperationStatus {
    Processing='Processing', Succeeded='Succeeded', Failed='Failed'
}

export interface FetchOf<TData> {
    data?: TData
    status: AsyncOperationStatus
}