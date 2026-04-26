import prisma from '../../utils/prisma.js';

export class PartsMasterService {
    static async getAll(query: any = {}) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');

        const where: any = {};
        if (effectiveSearch) {
            where.OR = [
                { partNumber: { contains: effectiveSearch, mode: 'insensitive' } },
                { partName: { contains: effectiveSearch, mode: 'insensitive' } }
            ];
        }

        const [parts, total] = await Promise.all([
            prisma.partsMaster.findMany({
                where,
                skip,
                take,
                include: {
                    hsn: true,
                    manufacturer: true,
                    vehicleSuit: true
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.partsMaster.count({ where })
        ]);

        return { parts, total, page: Number(page), limit: take };
    }

    static async getById(id: string) {
        return prisma.partsMaster.findUnique({
            where: { id },
            include: {
                hsn: true,
                manufacturer: true,
                vehicleSuit: true
            }
        });
    }

    static async create(data: any) {
        const { vehicleSuit, ...rest } = data;
        return prisma.partsMaster.create({
            data: {
                ...rest,
                vehicleSuit: vehicleSuit ? {
                    create: vehicleSuit.map((item: any) => ({
                        vehicleId: item.vehicle
                    }))
                } : undefined
            },
            include: {
                hsn: true,
                manufacturer: true,
                vehicleSuit: true
            }
        });
    }

    static async update(id: string, data: any) {
        const { vehicleSuit, ...rest } = data;

        // Use a transaction to ensure atomic update of relations
        return prisma.$transaction(async (tx) => {
            if (vehicleSuit) {
                // Delete existing associations
                await tx.multiVehicle.deleteMany({
                    where: { partsMasterId: id }
                });

                // Create new associations
                await tx.partsMaster.update({
                    where: { id },
                    data: {
                        ...rest,
                        vehicleSuit: {
                            create: vehicleSuit.map((item: any) => ({
                                vehicleId: item.vehicle
                            }))
                        }
                    }
                });
            } else {
                await tx.partsMaster.update({
                    where: { id },
                    data: rest
                });
            }

            return tx.partsMaster.findUnique({
                where: { id },
                include: {
                    hsn: true,
                    manufacturer: true,
                    vehicleSuit: true
                }
            });
        });
    }

    static async delete(id: string) {
        return prisma.partsMaster.delete({
            where: { id }
        });
    }
}
