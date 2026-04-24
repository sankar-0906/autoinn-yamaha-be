import prisma from '../../utils/prisma.js';

export class DealerService {
    static async getAll() {
        return prisma.dealer.findMany({
            include: {
                address: {
                    include: { district: true, state: true, country: true }
                },
                shippingAddresses: {
                    include: { branch: true, district: true, state: true, country: true }
                },
                createdBy: true
            }
        });
    }

    static async getById(id: string) {
        return prisma.dealer.findUnique({
            where: { id },
            include: {
                address: {
                    include: { district: true, state: true, country: true }
                },
                shippingAddresses: {
                    include: { branch: true, district: true, state: true, country: true }
                },
                createdBy: true
            }
        });
    }

    static async create(data: any) {
        // Handle both singular and plural from frontend
        const { address, shippingAddress, shippingAddresses, ...rest } = data;
        const inputShipping = shippingAddresses || (shippingAddress ? (Array.isArray(shippingAddress) ? shippingAddress : [shippingAddress]) : []);

        const normalizeAddress = async (addr: any) => {
            if (!addr || typeof addr !== 'object') return null;
            const { id: _, createdAt: __, updatedAt: ___, createdBy: ____, branch, ...cleanData } = addr;

            // Link branch if provided
            if (branch) {
                const foundBranch = await prisma.branch.findFirst({
                    where: {
                        OR: [
                            { id: branch },
                            { name: { contains: branch, mode: 'insensitive' } }
                        ]
                    }
                });
                if (foundBranch) {
                    (cleanData as any).branchId = foundBranch.id;
                }
            }

            return Object.keys(cleanData).length > 0 ? cleanData : null;
        };

        const billingData = await normalizeAddress(address);
        const shippingList = [];
        for (const s of inputShipping) {
            const normalized = await normalizeAddress(s);
            if (normalized) shippingList.push(normalized);
        }

        return prisma.dealer.create({
            data: {
                ...rest,
                address: billingData ? { create: billingData } : undefined,
                shippingAddresses: shippingList.length > 0 ? {
                    create: shippingList
                } : undefined
            },
            include: { address: true, shippingAddresses: true }
        });
    }

    static async update(id: string, data: any) {
        // Handle both singular and plural from frontend
        const { address, shippingAddress, shippingAddresses, ...rest } = data;
        const inputShipping = shippingAddresses || (shippingAddress ? (Array.isArray(shippingAddress) ? shippingAddress : [shippingAddress]) : []);

        const normalizeAddress = async (addr: any) => {
            if (!addr || typeof addr !== 'object') return null;
            const { id: _, createdAt: __, updatedAt: ___, createdBy: ____, branch, ...cleanData } = addr;

            // Link branch if provided
            if (branch) {
                const foundBranch = await prisma.branch.findFirst({
                    where: {
                        OR: [
                            { id: branch },
                            { name: { contains: branch, mode: 'insensitive' } }
                        ]
                    }
                });
                if (foundBranch) {
                    (cleanData as any).branchId = foundBranch.id;
                }
            }

            return Object.keys(cleanData).length > 0 ? cleanData : null;
        };

        return prisma.$transaction(async (tx) => {
            // Update main dealer data
            await tx.dealer.update({
                where: { id },
                data: rest
            });

            // Update billing address (1-1)
            const billingData = await normalizeAddress(address);
            if (billingData) {
                const currentDealer = await tx.dealer.findUnique({
                    where: { id },
                    select: { addressId: true }
                });

                if (currentDealer?.addressId) {
                    await tx.address.update({
                        where: { id: currentDealer.addressId },
                        data: billingData
                    });
                } else {
                    await tx.dealer.update({
                        where: { id },
                        data: { address: { create: billingData } }
                    });
                }
            }

            // Sync shipping addresses (1-M)
            if (Array.isArray(inputShipping)) {
                const currentAddresses = await tx.address.findMany({
                    where: { dealerShippingId: id }
                });

                const currentIds = currentAddresses.map((a: any) => a.id);
                const comingIds = inputShipping.filter((a: any) => a.id).map((a: any) => a.id);

                // 1. Delete removed
                const toDelete = currentIds.filter(cid => !comingIds.includes(cid));
                if (toDelete.length > 0) {
                    await tx.address.deleteMany({ where: { id: { in: toDelete } } });
                }

                // 2. Update/Create
                for (const addr of inputShipping) {
                    const cleanData = await normalizeAddress(addr);
                    if (!cleanData) continue;

                    if (addr.id && currentIds.includes(addr.id)) {
                        await tx.address.update({
                            where: { id: addr.id },
                            data: cleanData
                        });
                    } else {
                        await tx.address.create({
                            data: {
                                ...cleanData,
                                dealerShippingId: id
                            }
                        });
                    }
                }
            }

            return tx.dealer.findUnique({
                where: { id },
                include: {
                    address: true,
                    shippingAddresses: { include: { branch: true } }
                }
            });
        });
    }

    static async delete(id: string) {
        return prisma.dealer.delete({
            where: { id }
        });
    }
}
