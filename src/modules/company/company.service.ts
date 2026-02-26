import prisma from '../../utils/prisma.js';

export class CompanyService {
    static async getAll() {
        return prisma.company.findMany({
            include: {
                address: {
                    include: {
                        district: true,
                        state: true,
                        country: true
                    }
                },
                branches: true
            }
        });
    }

    static async getById(id: string) {
        return prisma.company.findUnique({
            where: { id },
            include: {
                address: {
                    include: {
                        district: true,
                        state: true,
                        country: true
                    }
                },
                branches: true
            }
        });
    }

    static async create(data: any, createdById?: string) {
        return prisma.company.create({
            data: {
                ...data,
                createdById
            },
            include: {
                address: true
            }
        });
    }

    static async update(id: string, data: any) {
        return prisma.company.update({
            where: { id },
            data,
            include: {
                address: true
            }
        });
    }

    static async delete(id: string) {
        return prisma.company.delete({
            where: { id }
        });
    }
}
