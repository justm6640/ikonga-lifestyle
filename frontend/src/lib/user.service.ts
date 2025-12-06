
import { fetchAPI } from './api';

export interface UserProfile {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    sexe?: string;
    paysOrigine?: string;
    paysResidence?: string;
    villeResidence?: string;
    dateNaissance?: string; // ISO
    contact?: string;
    tailleCm?: number;
    createdAt: string;
}

export const userService = {
    async getProfile(): Promise<UserProfile> {
        return await fetchAPI('/users/me');
    }
};
