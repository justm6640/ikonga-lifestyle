
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Récupère l'email depuis les arguments de la ligne de commande
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Erreur : Veuillez fournir un email.');
        console.error('Usage : npx ts-node prisma/promote-user.ts <email>');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: Role.ADMIN },
        });
        console.log(`✅ Succès : L'utilisateur ${email} est désormais ADMIN.`);
        console.log(user);
    } catch (error) {
        console.error(`❌ Erreur : Impossible de trouver ou de mettre à jour l'utilisateur ${email}.`);
        if (error instanceof Error) {
            // @ts-ignore
            if (error.code === 'P2025') {
                console.error("Raison : L'utilisateur n'existe pas dans la base de données.");
            } else {
                console.error(error.message);
            }
        }
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
