import prisma from '../../utils/prisma.js';
export class FrameNumberService {
    static async getAll(query = {}) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');
        const where = {};
        if (effectiveSearch) {
            where.OR = [
                { inferredField: { contains: effectiveSearch, mode: 'insensitive' } },
                { inputValue: { contains: effectiveSearch, mode: 'insensitive' } },
                { manufacturer: { name: { contains: effectiveSearch, mode: 'insensitive' } } }
            ];
            const numericSearch = Number(effectiveSearch);
            if (!isNaN(numericSearch)) {
                where.OR.push({ position: numericSearch });
            }
        }
        const [frameNumbers, total] = await Promise.all([
            prisma.frameNumber.findMany({
                where,
                skip,
                take,
                include: {
                    manufacturer: true,
                    createdBy: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.frameNumber.count({ where })
        ]);
        return { frameNumbers, total, page: Number(page), limit: take };
    }
    static async getById(id) {
        return prisma.frameNumber.findUnique({
            where: { id },
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }
    static async create(data) {
        return prisma.frameNumber.create({
            data,
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }
    static async update(id, data) {
        return prisma.frameNumber.update({
            where: { id },
            data,
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }
    static async delete(id) {
        return prisma.frameNumber.delete({
            where: { id }
        });
    }
    static async decodeChassisNo(chassisNo, manufacturerId) {
        if (!chassisNo || chassisNo.length < 10 || !manufacturerId)
            return null;
        const monthChar = chassisNo.charAt(8).toUpperCase(); // Position 9
        const yearChar = chassisNo.charAt(9).toUpperCase(); // Position 10
        const [monthRecord, yearRecord] = await Promise.all([
            prisma.frameNumber.findFirst({
                where: {
                    manufacturerId,
                    position: 9,
                    inputValue: monthChar
                }
            }),
            prisma.frameNumber.findFirst({
                where: {
                    manufacturerId,
                    position: 10,
                    inputValue: yearChar
                }
            })
        ]);
        if (yearRecord && yearRecord.targetValue) {
            const year = parseInt(yearRecord.targetValue);
            let month = 0; // Default to January
            if (monthRecord && monthRecord.targetValue) {
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const monthIdx = months.indexOf(monthRecord.targetValue.toUpperCase());
                if (monthIdx !== -1) {
                    month = monthIdx;
                }
            }
            return new Date(year, month, 1);
        }
        return null;
    }
}
