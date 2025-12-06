
import { fetchAPI } from './api';

export interface Ingredient {
    name: string;
    qty?: string;
    unit?: string;
}

export interface RecipeDetails {
    id: string;
    title: string;
    description: string;
    ingredients: any; // Raw JSON from DB
    steps: any;       // Raw JSON from DB
    calories: number;
    phaseTag: string;
}

export const recipesService = {
    async getRecipe(id: string): Promise<RecipeDetails> {
        return await fetchAPI(`/recipes/${id}`);
    }
};
