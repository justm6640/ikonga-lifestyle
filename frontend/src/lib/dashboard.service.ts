import { fetchAPI } from './api';

export interface MenuDuJour {
    petitDejeuner: string | null;
    dejeuner: string | null;
    diner: string | null;
    collation: string | null;
}

export interface DashboardKpis {
    poidsActuel: number | null;
    poidsTotalPerdu: number | null;
    phaseActuelle: string | null;
    jourDansLaPhase: number | null;
    menuDuJour: MenuDuJour | null;
}

export const dashboardService = {
    async getDashboard(): Promise<DashboardKpis> {
        return await fetchAPI('/me/dashboard');
    }
};
