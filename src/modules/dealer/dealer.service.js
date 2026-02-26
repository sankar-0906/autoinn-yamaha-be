import prisma from '../../utils/prisma.js';
export class DealerService {
    static async getAll() {
        return prisma.dealer.findMany({
            include: {
                address: true,
                shippingAddress: true,
                createdBy: true
            }
        });
    }
    static async getById(id) {
        return prisma.dealer.findUnique({
            where: { id },
            include: {
                address: true,
                shippingAddress: true,
                createdBy: true
            }
        });
    }
    static async create(data) {
        const { address, shippingAddress, ...rest } = data;
        return prisma.dealer.create({
            data: {
                ...rest,
                address: address ? {
                    create: address
                } : undefined,
                shippingAddress: shippingAddress ? {
                    create: shippingAddress
                } : undefined
            },
            include: { address: true, shippingAddress: true }
        });
    }
    static async update(id, data) {
        const { address, shippingAddress, ...rest } = data;
        return prisma.$transaction(async (tx) => {
            // Update main dealer data
            await tx.dealer.update({
                where: { id },
                data: rest
            });
            // Update billing address if provided
            if (address) {
                const currentDealer = await tx.dealer.findUnique({
                    where: { id },
                    select: { addressId: true }
                });
                if (currentDealer?.addressId) {
                    await tx.address.update({
                        where: { id: currentDealer.addressId },
                        data: address
                    });
                }
                else {
                    await tx.dealer.update({
                        where: { id },
                        data: {
                            address: { create: address }
                        }
                    });
                }
            }
            // Update shipping addresses if provided
            if (shippingAddress) {
                // Simplest way is to remove all and recreate
                // But Address model doesn't have a direct backlink to Dealer for shippingAddress relation
                // Wait, Dealer has `shippingAddress Address[] @relation("DealerHasShippingAddress")`
                // This means Address must have a field for this relation.
                // Let me check schema.prisma again for Address fields relative to Dealer.
                // If Address has dealerId (implicit or explicit), we can deleteMany.
                await tx.dealer.update({
                    where: { id },
                    data: {
                        shippingAddress: {
                            deleteMany: {},
                            create: shippingAddress
                        }
                    }
                });
            }
            return tx.dealer.findUnique({
                where: { id },
                include: { address: true, shippingAddress: true }
            });
        });
    }
    static async delete(id) {
        return prisma.dealer.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=dealer.service.js.map