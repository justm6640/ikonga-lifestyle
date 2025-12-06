
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@ikonga.com';
    const password = 'admin123'; // Changez-le après la première connexion !

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            role: Role.ADMIN, // Force le rôle ADMIN si l'utilisateur existe déjà
        },
        create: {
            email,
            passwordHash,
            firstName: 'Super',
            lastName: 'Admin',
            role: Role.ADMIN,
        },
    });

    console.log({ admin });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
