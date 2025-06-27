export interface Departmax
{
    departmaxId?: number;
    name?: string;
    detail?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DepartmaxPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}