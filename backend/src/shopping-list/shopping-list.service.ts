
import { Injectable, NotFoundException } from '@nestjs/common';
import { MenusService } from '../menus/menus.service';
import { CreateRecipeDto, IngredientDto } from '../recipes/dto/create-recipe.dto';
import { PhaseType } from '@prisma/client';
import { formatQuantity } from '../utils/quantity';

export interface ShoppingListItem {
    ingredient: string;
    quantity: number;
    unit: string;
}

export interface WeeklyShoppingList {
    week: number;
    phase: PhaseType;
    categories: Record<string, ShoppingListItem[]>;
}

@Injectable()
export class ShoppingListService {
    constructor(private menusService: MenusService) { }

    async getWeeklyShoppingList(userId: string): Promise<WeeklyShoppingList> {
        // 1. Get the current menu for the user
        const result = await this.menusService.getCurrentMenuForUser(userId);

        if (!result || !result.menu) {
            throw new NotFoundException('Aucun menu trouvé pour cette semaine. Impossible de générer la liste de courses.');
        }

        const { menu } = result;

        // 2. Collect all ingredients
        const rawIngredients: IngredientDto[] = [];
        const mealTypes = ['petitDejeuner', 'dejeuner', 'diner'] as const;

        for (const day of menu.days) {
            for (const type of mealTypes) {
                const recipe = day[type];
                if (recipe && Array.isArray(recipe.ingredients)) {
                    // Force cast or safely map if it's already structured JSON
                    const ingredients = recipe.ingredients as unknown as IngredientDto[];
                    rawIngredients.push(...ingredients);
                }
            }
        }

        // 3. Aggregate by ingredient + unit
        const aggregatedMap = new Map<string, IngredientDto>();

        for (const item of rawIngredients) {
            // Key = lowercase ingredient + unit to group same items
            const key = `${item.ingredient.toLowerCase()}_${item.unit.toLowerCase()}`;

            if (aggregatedMap.has(key)) {
                const existing = aggregatedMap.get(key)!;
                existing.quantity += item.quantity;
            } else {
                aggregatedMap.set(key, { ...item }); // Clone to avoid mutation issues
            }
        }

        // 4. Group by category
        const categories: Record<string, ShoppingListItem[]> = {};

        aggregatedMap.forEach((item) => {
            const cat = item.category || 'Autres';
            if (!categories[cat]) {
                categories[cat] = [];
            }

            // Format quantity (g -> kg, ml -> l)
            const formatted = formatQuantity(item.quantity, item.unit);

            categories[cat].push({
                ingredient: item.ingredient,
                quantity: formatted.quantity,
                unit: formatted.unit
            });
        });

        // Optional: Sort categories or items if needed
        return {
            week: menu.semaineNumero,
            phase: menu.phase,
            categories
        };
    }
}
