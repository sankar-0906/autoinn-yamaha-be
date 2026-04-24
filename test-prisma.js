import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.supplier.count();
    console.log('Supplier count:', count);
    const suppliers = await prisma.supplier.findMany({ take: 1 });
    console.log('Sample supplier:', suppliers);
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
//# sourceMappingURL=test-prisma.js.map