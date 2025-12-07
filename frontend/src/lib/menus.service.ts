
import { fetchAPI } from './api';

export interface Recipe {
    id: string;
    title: string;
    description?: string;
    calories?: number;
    // other fields omitted
}

// Alias for consistency
export type MenuMeal = Recipe;

export interface MenuDay {
    id: string;
    jourNumero: number;
    petitDejeuner?: MenuMeal;
    dejeuner?: MenuMeal;
    collation?: MenuMeal;
    diner?: MenuMeal;
}

export interface MenuWeek {
    id: string;
    phase: string;
    semaineNumero: number;
    days: MenuDay[];
}

export interface CurrentMenuResponse {
    status: any;
    menu: MenuWeek | null;
}

export const menusService = {
    async getCurrentMenu(): Promise<CurrentMenuResponse | null> {
        return await fetchAPI('/menus/current');
    }
};
