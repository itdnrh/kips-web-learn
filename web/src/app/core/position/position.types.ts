export interface Position
{
    positionId?: number;
    name?: string;
    detail?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PositionPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}