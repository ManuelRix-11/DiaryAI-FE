import { apiClient } from './apiClient';
import { AuthUser } from "@/model/user";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    username: string;
    email: string;
    password: string;
};

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    password?: string;
};

export const usersApi = {
    login: (payload: LoginPayload) =>
        apiClient.post<AuthUser>('/users/login', payload),

    register: (payload: RegisterPayload) =>
        apiClient.post<AuthUser>('/users/register', payload),

    list: () =>
        apiClient.get<AuthUser[]>('/users/'),

    getById: (id: string) =>
        apiClient.get<AuthUser>(`/users/${id}`),

    update: (id: string, payload: UpdateUserPayload) =>
        apiClient.put<AuthUser>(`/users/${id}`, payload),
    getStats: (id: string) =>
        apiClient.get<number[]>(`/users/${id}/stats`),

    remove: (id: string) =>
        apiClient.delete<{ message: string }>(`/users/${id}`),

    search: (searchTerm: string) =>
        apiClient.get<AuthUser[]>(`/users/search/${encodeURIComponent(searchTerm)}`),
};