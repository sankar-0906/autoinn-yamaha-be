import prisma from '../../utils/prisma.js';

export class BranchService {
    static async createBranch(data: any, userId?: string) {
        return prisma.branch.create({
            data: {
                ...data,
                ...(userId ? { createdById: userId } : {}),
            },
        });
    }

    static async getAllBranches(query: any) {
        const { page = 1, limit = 10, search = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { gst: { contains: search, mode: 'insensitive' as const } },
                ],
            }
            : {};

        const [branches, total] = await Promise.all([
            prisma.branch.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    address: true,
                    company: true,
                },
            }),
            prisma.branch.count({ where }),
        ]);

        return { branches, total, page, limit };
    }

    static async getBranchById(id: string) {
        return prisma.branch.findUnique({
            where: { id },
            include: {
                address: true,
                company: true,
                contacts: true,
            },
        });
    }

    static async updateBranch(id: string, data: any) {
        return prisma.branch.update({
            where: { id },
            data,
        });
    }

    static async deleteBranch(id: string) {
        return prisma.branch.delete({
            where: { id },
        });
    }
}
