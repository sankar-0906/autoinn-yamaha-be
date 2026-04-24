import prisma from './src/utils/prisma.js';
async function main() {
    console.log('Querying ID Generator rules...');
    const rules = await prisma.idCreation.findMany({
        include: { branch: true }
    });
    console.log('ID Generator Rules:');
    console.log(JSON.stringify(rules, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=check_rules.js.map