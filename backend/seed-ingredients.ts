
import { PrismaClient, PhaseType } from '@prisma/client';

const prisma = new PrismaClient();

const sampleIngredients = [
    { ingredient: 'Tomates', quantity: 200, unit: 'g', category: 'Légumes' },
    { ingredient: 'Poulet', quantity: 150, unit: 'g', category: 'Viandes' },
    { ingredient: 'Riz', quantity: 80, unit: 'g', category: 'Féculents' },
    { ingredient: 'Huile d\'olive', quantity: 10, unit: 'ml', category: 'Épicerie' },
    { ingredient: 'Oignon', quantity: 1, unit: 'pièce', category: 'Légumes' }
];

const smoothieIngredients = [
    { ingredient: 'Banane', quantity: 1, unit: 'pièce', category: 'Fruits' },
    { ingredient: 'Epinards', quantity: 50, unit: 'g', category: 'Légumes' },
    { ingredient: 'Lait d\'amande', quantity: 200, unit: 'ml', category: 'Boissons' }
];

async function main() {
    console.log('Seeding ingredients...');

    // Update all recipes to have some ingredients if they are empty
    const recipes = await prisma.recipe.findMany();

    for (const recipe of recipes) {
        // Simple logic: if title contains smoothie, give smoothie ingredients, else sample meal
        const ingredients = recipe.title.toLowerCase().includes('smoothie')
            ? smoothieIngredients
            : sampleIngredients;

        await prisma.recipe.update({
            where: { id: recipe.id },
            data: {
                ingredients: ingredients as any
            }
        });
        console.log(`Updated recipe ${recipe.title}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
