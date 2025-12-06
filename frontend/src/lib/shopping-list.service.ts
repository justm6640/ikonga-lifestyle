
import { fetchAPI } from './api';

export interface ShoppingListItem {
    ingredient: string;
    quantity: number;
    unit: string;
}

export interface WeeklyShoppingList {
    week: number;
    phase: string;
    categories: Record<string, ShoppingListItem[]>;
}

export const shoppingListService = {
    async getWeeklyShoppingList(): Promise<WeeklyShoppingList> {
        return fetchAPI<WeeklyShoppingList>('/shopping-list/week');
    },
};
