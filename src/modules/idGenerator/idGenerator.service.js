import prisma from '../../utils/prisma.js';
export class IdGeneratorService {
    static async getAll() {
        return prisma.idCreation.findMany({
            include: {
                branch: true,
                createdBy: true
            }
        });
    }
    static async getById(id) {
        return prisma.idCreation.findUnique({
            where: { id },
            include: {
                branch: true,
                createdBy: true
            }
        });
    }
    static async create(data) {
        return prisma.idCreation.create({
            data,
            include: {
                branch: true,
                createdBy: true
            }
        });
    }
    static async update(id, data) {
        return prisma.idCreation.update({
            where: { id },
            data,
            include: {
                branch: true,
                createdBy: true
            }
        });
    }
    static async delete(id) {
        return prisma.idCreation.delete({
            where: { id }
        });
    }
    static async generateNextId(subModule, branchId) {
        // 1. Try to find branch-specific rule
        let rule = await prisma.idCreation.findFirst({
            where: {
                subModule: subModule,
                branchId: branchId || null,
                OR: [
                    { scope: 'BRANCH' },
                    { scope: 'Branch level' }
                ]
            }
        });
        // 2. If not found, try company level
        if (!rule) {
            rule = await prisma.idCreation.findFirst({
                where: {
                    subModule: subModule,
                    OR: [
                        { scope: 'COMPANY' },
                        { scope: 'Company level' }
                    ]
                }
            });
        }
        if (!rule || !rule.count || !rule.text) {
            console.log(`[IdGenerator] No rule found for ${subModule}`);
            return null;
        }
        const text = rule.text;
        const count = rule.count;
        const id = rule.id;
        const currentId = `${text}${count}`;
        // 3. Prepare next count
        const countInt = parseInt(count);
        const nextCountInt = countInt + 1;
        const nextCount = nextCountInt.toString().padStart(count.length, '0');
        // 4. Update the counter
        await prisma.idCreation.update({
            where: { id },
            data: { count: nextCount }
        });
        console.log(`[IdGenerator] Generated ID: ${currentId} for ${subModule}`);
        return currentId;
    }
}
//# sourceMappingURL=idGenerator.service.js.map