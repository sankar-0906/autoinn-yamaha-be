import prisma from '../../utils/prisma.js';
export class HsnService {
    static async createHsn(data, userId) {
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
    static async getAllHsns(query) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const effectiveSearch = String(search || searchString || '');
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;
        const where = {};
        if (effectiveSearch) {
            where.OR = [
                { code: { contains: effectiveSearch, mode: 'insensitive' } },
                { description: { contains: effectiveSearch, mode: 'insensitive' } }
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
    static async getHsnById(id) {
        return prisma.hsn.findUnique({
            where: { id }
        });
    }
    static async updateHsn(id, data) {
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
    static async deleteHsn(id) {
        return prisma.hsn.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=hsn.service.js.map