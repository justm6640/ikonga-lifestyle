
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Récupère l'email depuis les arguments de la ligne de commande
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Erreur : Veuillez fournir un email.');
        console.error('Usage : npx ts-node prisma/check-role.ts <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { email: true, role: true, firstName: true, lastName: true },
        });

        if (user) {
            console.log(`👤 Utilisateur trouvé :`);
            console.log(`-----------------------`);
            console.log(`Email : ${user.email}`);
            console.log(`Rôle  : ${user.role}`);
            console.log(`Nom   : ${user.firstName} ${user.lastName}`);
            console.log(`-----------------------`);
        } else {
            console.error(`❌ Erreur : Aucun utilisateur trouvé avec l'email ${email}.`);
        }
    } catch (error) {
        console.error(`❌ Erreur inattendue :`, error);
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
