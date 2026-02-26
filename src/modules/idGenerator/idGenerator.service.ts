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
}
