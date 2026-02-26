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

    static async getById(id: string) {
        return prisma.frameNumber.findUnique({
            where: { id },
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }

    static async create(data: any) {
        return prisma.frameNumber.create({
            data,
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }

    static async update(id: string, data: any) {
        return prisma.frameNumber.update({
            where: { id },
            data,
            include: {
                manufacturer: true,
                createdBy: true
            }
        });
    }

    static async delete(id: string) {
        return prisma.frameNumber.delete({
            where: { id }
        });
    }
}
