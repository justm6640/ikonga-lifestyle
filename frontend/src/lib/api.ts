
const API_URL = 'http://localhost:3001';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    // Ensure we are in the browser before accessing localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    } as HeadersInit;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export function saveToken(token: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
}

export function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
}

export function removeToken() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}
