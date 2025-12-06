
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking recipes...');
    const recipes = await prisma.recipe.findMany({
        take: 5,
        select: { title: true, ingredients: true, phaseTag: true }
    });
    console.log(JSON.stringify(recipes, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
