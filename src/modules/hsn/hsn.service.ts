import prisma from '../../utils/prisma.js';

export class HsnService {
    static async createHsn(data: any, userId?: string) {
        const { id, createdById, createdAt, updatedAt, ...rest } = data;
        const code = rest.code?.toString();
        const hsnData = {
            description: rest.description,
            igst: parseFloat(rest.igst) || 0,
            cgst: parseFloat(rest.cgst) || 0,
            sgst: parseFloat(rest.sgst) || 0,
            cess: parseFloat(rest.cess) || 0,
            ...(userId ? { createdBy: { connect: { id: userId } } } : {})
        };

        return prisma.hsn.upsert({
            where: { code },
            update: hsnData,
            create: {
                ...hsnData,
                code
            }
        });
    }

    static async getAllHsns(query: any) {
        const {
            page = 1,
            limit = 10,
            search = '',
            searchString = ''
        } = query;

        const effectiveSearch = String(search || searchString || '');
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const where: any = {};
        if (effectiveSearch) {
            where.OR = [
                { code: { contains: effectiveSearch, mode: 'insensitive' as const } },
                { description: { contains: effectiveSearch, mode: 'insensitive' as const } }
            ];
        }

        const [hsns, total] = await Promise.all([
            prisma.hsn.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.hsn.count({ where })
        ]);

        return { hsns, total, page, limit: take };
    }

    static async getHsnById(id: string) {
        return prisma.hsn.findUnique({
            where: { id }
        });
    }

    static async updateHsn(id: string, data: any) {
        const { id: _, createdById, createdAt, updatedAt, ...rest } = data;
        return prisma.hsn.update({
            where: { id },
            data: {
                ...rest,
                code: rest.code?.toString(),
                igst: parseFloat(rest.igst) || 0,
                cgst: parseFloat(rest.cgst) || 0,
                sgst: parseFloat(rest.sgst) || 0,
                cess: parseFloat(rest.cess) || 0,
            }
        });
    }

    static async deleteHsn(id: string) {
        return prisma.hsn.delete({
            where: { id }
        });
    }
}
