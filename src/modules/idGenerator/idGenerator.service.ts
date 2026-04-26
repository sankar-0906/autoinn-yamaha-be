import prisma from '../../utils/prisma.js';

export class IdGeneratorService {
    static async getAll(query: any = {}) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');

        const where: any = {};
        if (effectiveSearch) {
            where.OR = [
                { subModule: { contains: effectiveSearch, mode: 'insensitive' } },
                { text: { contains: effectiveSearch, mode: 'insensitive' } }
            ];
        }

        const [idCreations, total] = await Promise.all([
            prisma.idCreation.findMany({
                where,
                skip,
                take,
                include: {
                    branch: true,
                    createdBy: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.idCreation.count({ where })
        ]);

        return { idCreations, total, page: Number(page), limit: take };
    }

    static async getById(id: string) {
        return prisma.idCreation.findUnique({
            where: { id },
            include: {
                branch: true,
                createdBy: true
            }
        });
    }

    static async create(data: any) {
        return prisma.idCreation.create({
            data,
            include: {
                branch: true,
                createdBy: true
            }
        });
    }

    static async update(id: string, data: any) {
        return prisma.idCreation.update({
            where: { id },
            data,
            include: {
                branch: true,
                createdBy: true
            }
        });
    }

    static async delete(id: string) {
        return prisma.idCreation.delete({
            where: { id }
        });
    }

    static async generateNextId(subModule: string, branchId?: string) {
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
