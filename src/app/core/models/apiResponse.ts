export interface ApiResponse<T> {
    id: string;
    status: number;
    message: string;
    data: T;
}

export interface ApiError {
    code: number,
    message: string,
    timestamp: string
}

export const defaultApiError = {
        code: 500,
        message: 'Unknown error occurred',
        timestamp: new Date().toISOString()
};