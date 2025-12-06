import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'test.signup@ikonga.com';
    console.log(`Checking for user with email: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (user) {
        console.log('--------------------------------------------------');
        console.log('USER FOUND IN DATABASE:');
        console.log('ID:', user.id);
        console.log('Email:', user.email);
        console.log('Name:', `${user.firstName} ${user.lastName}`);
        console.log('Sexe:', user.sexe);
        console.log('Pays Origine:', user.paysOrigine);
        console.log('Pays Residence:', user.paysResidence);
        console.log('Ville:', user.villeResidence);
        console.log('Date Naissance:', user.dateNaissance);
        console.log('Contact:', user.contact);
        console.log('Taille (cm):', user.tailleCm);
        console.log('--------------------------------------------------');
    } else {
        console.log('User not found.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
