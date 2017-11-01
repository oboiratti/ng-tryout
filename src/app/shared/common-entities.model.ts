export interface ResponseObject<T> {
    data: T;
    success: boolean;
    message: string;
    total: number;
}

export interface SearchCriteria {
    key: string
    value: object
    operation: string
}