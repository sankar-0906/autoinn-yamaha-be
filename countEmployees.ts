import prisma from './src/utils/prisma.js';

async function main() {
    const activeEmployees = await prisma.user.findMany({
        where: {
            status: true,
        },
        include: {
            profile: true
        }
    });

    console.log(`Total Active Employees: ${activeEmployees.length}`);
    activeEmployees.forEach(e => {
        console.log(`- ID: ${e.id}, Email: ${e.email}, Name: ${e.profile?.employeeName || 'No Name'}, Status: ${e.status}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
