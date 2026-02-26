import prisma from '../../utils/prisma.js';

export class PartsMasterService {
    static async getAll() {
        return prisma.partsMaster.findMany({
            include: {
                hsn: true,
                manufacturer: true,
                vehicleSuit: true
            }
        });
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
            include: { vehicleSuit: true }
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
                include: { vehicleSuit: true }
            });
        });
    }

    static async delete(id: string) {
        return prisma.partsMaster.delete({
            where: { id }
        });
    }
}
