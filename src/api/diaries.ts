import { apiClient } from './apiClient';
import { Diary } from "@/model/diary";

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
        apiClient.get<Diary[]>('/diaries/'),

    getById: (id: string) =>
        apiClient.get<Diary>(`/diaries/${id}`),

    getByUserId: (userId: string) =>
        apiClient.get<Diary[]>(`/diaries/user/${userId}`),

    create: (payload: CreateDiaryPayload) =>
        apiClient.post<Record<string, string>>('/diaries/', payload),

    update: (id: string, payload: UpdateDiaryPayload) =>
        apiClient.put<Diary>(`/diaries/${id}`, payload),

    remove: (id: string) =>
        apiClient.delete<void>(`/diaries/${id}`),

    analyzeSentiment: (text: string) =>
        apiClient.post<SentimentResponse>(`/diaries/sentiment?text=${encodeURIComponent(text)}`),
};