
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log(`📋 Liste des utilisateurs (${users.length}) :`);
        console.log('---------------------------------------------------------------------------------');
        console.log('| Email                          | Rôle       | Nom complet          | Inscrit le      |');
        console.log('---------------------------------------------------------------------------------');

        users.forEach((user) => {
            const email = user.email.padEnd(30);
            const role = user.role.padEnd(10);
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().padEnd(20);
            const date = user.createdAt.toISOString().split('T')[0];

            console.log(`| ${email} | ${role} | ${fullName} | ${date}      |`);
        });

        console.log('---------------------------------------------------------------------------------');

    } catch (error) {
        console.error(`❌ Erreur lors de la récupération des utilisateurs :`, error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
