import { apiClient } from './apiClient';
import { Diary } from "@/model/diary";
import { invalidateCacheByPrefix } from '../utils/apiCache';

export type CreateDiaryPayload = {
    title: string;
    user_id: string;
};

export type UpdateDiaryPayload = {
    title?: string;
    text?: string;
};

export type SentimentResponse = {
    sentiment: string;
    score: number;
    sentiments: Array<Record<string, any>>;
};

export const diariesApi = {
    list: () =>
        apiClient.get<Diary[]>('/diaries/', undefined, 'diaries_list'),

    getById: (id: string) =>
        apiClient.get<Diary>(`/diaries/${id}`, undefined, `diaries_${id}`),

    getByUserId: (userId: string) =>
        apiClient.get<Diary[]>(`/diaries/user/${userId}`, undefined, `diaries_user_${userId}`),

    create: async (payload: CreateDiaryPayload) => {
        const res = await apiClient.post<Record<string, string>>('/diaries/', payload);
        await invalidateCacheByPrefix('diaries_');
        await invalidateCacheByPrefix('stats_');
        return res;
    },

    update: async (id: string, payload: UpdateDiaryPayload) => {
        const res = await apiClient.put<Diary>(`/diaries/${id}`, payload);
        await invalidateCacheByPrefix('diaries_');
        await invalidateCacheByPrefix('stats_');
        return res;
    },

    remove: async (id: string) => {
        const res = await apiClient.delete<void>(`/diaries/${id}`);
        await invalidateCacheByPrefix('diaries_');
        await invalidateCacheByPrefix('stats_');
        return res;
    },

    analyzeSentiment: (text: string) =>
        apiClient.post<SentimentResponse>(`/diaries/sentiment?text=${encodeURIComponent(text)}`),
};