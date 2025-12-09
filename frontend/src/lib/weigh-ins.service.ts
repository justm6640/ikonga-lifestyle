
import { fetchAPI } from './api';

export interface WeighIn {
    id: string;
    userId: string;
    date: string; // ISO Date String
    weightKg: number;
    note?: string;
    photoUrl?: string;
    createdAt: string;
}

// Interface for API Payload
export interface CreateWeighInPayload {
    date?: string; // ISO Date "YYYY-MM-DD"
    weightKg: number;
    note?: string;
    photo?: File; // Added for file upload
}

export interface WeighInStats {
    lastWeightKg: number | null;
    lastDate: string | null;
    minWeightKg: number | null;
    maxWeightKg: number | null;
    imc: number | null;
    imcCategory: string | null;
}

export type WeighInPeriod = '3d' | '7d' | '30d' | 'all' | 'custom';

export const weighInsService = {
    async create(data: CreateWeighInPayload): Promise<WeighIn> {
        if (data.photo) {
            const formData = new FormData();
            if (data.date) formData.append('date', data.date);
            formData.append('weightKg', data.weightKg.toString());
            if (data.note) formData.append('note', data.note);
            formData.append('photo', data.photo);

            return fetchAPI<WeighIn>('/weigh-ins', {
                method: 'POST',
                body: formData,
            });
        }

        return fetchAPI<WeighIn>('/weigh-ins', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getAll(period: WeighInPeriod = '7d', startDate?: string, endDate?: string): Promise<WeighIn[]> {
        let url = `/weigh-ins?period=${period}`;
        if (period === 'custom' && startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        return fetchAPI<WeighIn[]>(url);
    },

    async getStats(): Promise<WeighInStats> {
        return fetchAPI<WeighInStats>('/weigh-ins/stats');
    },
};
