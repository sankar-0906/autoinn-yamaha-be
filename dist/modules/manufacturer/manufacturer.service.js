import prisma from '../../utils/prisma.js';
export class ManufacturerService {
    static async getAll(query = {}) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');
        const where = {};
        if (effectiveSearch) {
            where.name = { contains: effectiveSearch, mode: 'insensitive' };
        }
        const [manufacturers, total] = await Promise.all([
            prisma.manufacturer.findMany({
                where,
                skip,
                take,
                include: { address: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.manufacturer.count({ where })
        ]);
        return { manufacturers, total, page: Number(page), limit: take };
    }
    static async getById(id) {
        return prisma.manufacturer.findUnique({
            where: { id },
            include: { address: true }
        });
    }
    static async create(data) {
        const { line1, line2, line3, locality, cityId, stateId, countryId, pincode, ...rest } = data;
        return prisma.manufacturer.create({
            data: {
                ...rest,
                address: {
                    create: {
                        line1,
                        line2,
                        line3,
                        locality,
                        // only connect if IDs are defined
                        ...(cityId ? { district: { connect: { id: cityId } } } : {}),
                        ...(stateId ? { state: { connect: { id: stateId } } } : {}),
                        ...(countryId ? { country: { connect: { id: countryId } } } : {}),
                        pincode,
                    },
                },
            },
            include: {
                address: {
                    include: {
                        district: true,
                        state: true,
                        country: true,
                    },
                },
            },
        });
    }
    static async update(id, data) {
        const { line1, line2, line3, locality, cityId, stateId, countryId, pincode, ...rest } = data;
        return prisma.manufacturer.update({
            where: { id },
            data: {
                ...rest,
                address: {
                    update: {
                        line1,
                        line2,
                        line3,
                        locality,
                        district: cityId ? { connect: { id: cityId } } : undefined,
                        state: stateId ? { connect: { id: stateId } } : undefined,
                        country: countryId ? { connect: { id: countryId } } : undefined,
                        pincode
                    }
                }
            },
            include: { address: { include: { district: true, state: true, country: true } } }
        });
    }
    static async delete(id) {
        return prisma.manufacturer.delete({
            where: { id }
        });
    }
}
