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
}
//# sourceMappingURL=idGenerator.service.js.map