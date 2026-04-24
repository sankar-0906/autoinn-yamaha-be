import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        where: { employee: true },
        include: { profile: { include: { branch: true } }, branchInChargeOf: true }
    });
    console.log(JSON.stringify(users.map(u => ({
        id: u.id,
        name: u.profile?.employeeName,
        status: u.status,
        profileBranches: u.profile?.branch?.map(b => b.name),
        inChargeBranches: u.branchInChargeOf?.map(b => b.name)
    })), null, 2));
    const branches = await prisma.branch.findMany({
        include: { employeeProfiles: true, personInCharge: true }
    });
    console.log(JSON.stringify(branches.map(b => ({
        id: b.id,
        name: b.name,
        profileCount: b.employeeProfiles.length,
        inChargeCount: b.personInCharge.length
    })), null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=query.js.map