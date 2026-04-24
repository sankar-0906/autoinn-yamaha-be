import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const rawCount = await prisma.$queryRaw `SELECT COUNT(*) FROM "_UserProfileHasBranch"`;
    console.log("Raw _UserProfileHasBranch count:", rawCount);
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=test_sql.js.map