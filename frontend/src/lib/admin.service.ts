
import { fetchAPI } from './api';

export interface AdminUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'ADMIN' | 'COACH' | 'ABONNE';
    createdAt: string;
}

export interface AdminUserOverview {
    user: AdminUser;
    activeSubscription: any; // We can refine types later
    programStatus: any;
    weightStats: any;
}

export const adminService = {
    async getUsers(page = 1, limit = 10): Promise<{ data: AdminUser[]; page: number; limit: number }> {
        return fetchAPI(`/admin/users?page=${page}&limit=${limit}`);
    },

    async getUserOverview(id: string): Promise<AdminUserOverview> {
        return fetchAPI(`/admin/users/${id}/overview`);
    },

    async updateUserRole(id: string, role: string) {
        return fetchAPI(`/admin/users/${id}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
        });
    }
};
