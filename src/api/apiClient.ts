const BASE_URL = 'http://192.168.1.73:8000';

type ApiOptions = RequestInit & {
    headers?: Record<string, string>;
};

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            typeof data === 'object' && data !== null && 'message' in data
                ? String((data as { message?: string }).message)
                : `HTTP error ${response.status}`;
        throw new Error(message);
    }

    return data as T;
}

export const apiClient = {
    get: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'GET', headers }),

    post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, {
            method: 'POST',
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers,
        }),

    put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers,
        }),

    patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, {
            method: 'PATCH',
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers,
        }),

    delete: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: 'DELETE', headers }),
};