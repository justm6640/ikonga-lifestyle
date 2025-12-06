
import { fetchAPI } from './api';

export interface WeighIn {
    id: string;
    userId: string;
    date: string; // ISO Date String
    weightKg: number;
    note?: string;
    createdAt: string;
}

// Interface for API Payload
export interface CreateWeighInPayload {
    date?: string; // ISO Date "YYYY-MM-DD"
    weightKg: number;
    note?: string;
}

export interface WeighInStats {
    lastWeightKg: number | null;
    lastDate: string | null;
    minWeightKg: number | null;
    maxWeightKg: number | null;
    imc: number | null;
    imcCategory: string | null;
}

export type WeighInPeriod = '7d' | '30d' | 'all';

export const weighInsService = {
    async create(data: CreateWeighInPayload): Promise<WeighIn> {
        return fetchAPI<WeighIn>('/weigh-ins', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getAll(period: WeighInPeriod = '7d'): Promise<WeighIn[]> {
        return fetchAPI<WeighIn[]>(`/weigh-ins?period=${period}`);
    },

    async getStats(): Promise<WeighInStats> {
        return fetchAPI<WeighInStats>('/weigh-ins/stats');
    },
};
