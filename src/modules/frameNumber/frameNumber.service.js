import prisma from '../../utils/prisma.js';
export class FrameNumberService {
    static async getAll() {
        return prisma.frameNumber.findMany({
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
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
}
//# sourceMappingURL=frameNumber.service.js.map