import { SearchCriteria } from "../shared/common-entities.model";

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    token: string;
    role: Role;
}

export interface Role {
    id: number;
    name: string;
    notes: string;
    privileges: string;
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface UserQuery {
    page: number;
    size: number;
    sortField: string;
    sortOrder: number;
    queryParams: SearchCriteria[];
}