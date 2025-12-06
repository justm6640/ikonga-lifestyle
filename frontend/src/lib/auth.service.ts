
import { fetchAPI, saveToken, removeToken } from './api';


export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    sexe?: string;
    paysOrigine?: string;
    paysResidence?: string;
    villeResidence?: string;
    dateNaissance?: string;
    contact?: string;
    tailleCm?: number;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (data.access_token) {
            saveToken(data.access_token);
        }
        return data;
    },

    async signup(data: SignupData) {
        const response = await fetchAPI('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        // If signup auto-logs in (returns token)
        if (response.access_token) {
            saveToken(response.access_token);
        }
        return response;
    },

    async getProfile(): Promise<UserProfile> {
        return await fetchAPI('/users/me');
    },

    async getProgramStatus(): Promise<ProgramStatus> {
        return await fetchAPI('/users/me/program-status');
    },

    logout() {
        removeToken();
    }
};

export interface ProgramStatus {
    hasActiveSubscription: boolean;
    phase: string | null;
    dayInPhase: number | null;
    weekInPhase: number | null;
    dayInProgram: number | null;
    isFinished?: boolean;
}
