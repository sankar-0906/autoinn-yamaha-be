import prisma from '../../utils/prisma.js';

export class VehicleInventoryService {
    static async getSummary(query: any, branchIds?: string[]) {
        const { dealerId, category } = query;

        const where: any = {
            status: 'AVAILABLE'
        };

        if (dealerId && dealerId !== 'all') {
            where.lineItem = {
                inward: {
                    dealerId: dealerId
                }
            };
        }

        if (branchIds && branchIds.length > 0 && !branchIds.includes('ALL')) {
            where.lineItem = {
                ...(where.lineItem || {}),
                inward: {
                    ...(where.lineItem?.inward || {}),
                    branchId: { in: branchIds }
                }
            };
        }

        const vehicles = await (prisma as any).individualVehicle.findMany({
            where,
            include: {
                lineItem: {
                    include: {
                        vehicleMaster: true,
                        inward: {
                            include: { dealer: true, branch: true }
                        }
                    }
                },
                image: true
            }
        });

        // Filter by category in JS to avoid deep nesting complexities in prisma for now
        let filteredVehicles = vehicles;
        if (category && category !== 'all') {
            filteredVehicles = vehicles.filter((v: any) => v.lineItem?.vehicleMaster?.category === category);
        }

        // Aggregation logic
        const groups: Record<string, any> = {};
        filteredVehicles.forEach((v: any) => {
            const master = v.lineItem?.vehicleMaster;
            if (!master) return;

            const dealer = v.lineItem?.inward?.dealer;
            const branch = v.lineItem?.inward?.branch;
            const colorCode = v.colorCode || 'UNKNOWN';
            const key = `${master.id}_${colorCode}`;

            if (!groups[key]) {
                groups[key] = {
                    key,
                    modelName: master.modelName,
                    modelId: master.id,
                    modelCode: master.modelCode,
                    category: master.category,
                    color: v.image?.color || v.colorCode || 'UNKNOWN',
                    colorCode: v.colorCode,
                    dealers: [],
                    branches: [],
                    dealerName: '',
                    branchName: '',
                    quantity: 0,
                    imageUrl: v.image?.url || null
                };
            }
            
            groups[key].quantity += 1;
            
            if (dealer) {
                const alreadyAdded = groups[key].dealers.find((d: any) => d.id === dealer.id);
                if (!alreadyAdded) {
                    groups[key].dealers.push({ id: dealer.id, name: dealer.name });
                }
            }

            if (branch) {
                const alreadyAdded = groups[key].branches.find((b: any) => b.id === branch.id);
                if (!alreadyAdded) {
                    groups[key].branches.push({ id: branch.id, name: branch.name });
                }
            }
        });

        // Post-process to join names
        Object.values(groups).forEach(group => {
            group.dealerName = group.dealers.map((d: any) => d.name).join(', ');
            group.branchName = group.branches.map((b: any) => b.name).join(', ');
        });

        return Object.values(groups).sort((a, b) => a.modelName.localeCompare(b.modelName));
    }

    static async getDetails(query: any, branchIds?: string[]) {
        const { modelId, colorCode, dealerId } = query;

        if (!modelId) throw new Error("modelId is required");

        const where: any = {
            status: 'AVAILABLE',
            lineItem: {
                vehicleMasterId: modelId
            }
        };

        if (colorCode && colorCode !== 'UNKNOWN') {
            where.colorCode = colorCode;
        }

        if (dealerId && dealerId !== 'all') {
            where.lineItem.inward = {
                ...(where.lineItem.inward || {}),
                dealerId: dealerId
            };
        }

        if (branchIds && branchIds.length > 0 && !branchIds.includes('ALL')) {
            where.lineItem.inward = {
                ...(where.lineItem.inward || {}),
                branchId: { in: branchIds }
            };
        }

        return await (prisma as any).individualVehicle.findMany({
            where,
            include: {
                lineItem: {
                    include: {
                        vehicleMaster: true,
                        inward: {
                            include: { dealer: true, branch: true }
                        }
                    }
                },
                image: true
            },
            orderBy: { mfgDate: 'asc' }
        });
    }

    static async getCounts(query: any, branchIds?: string[]) {
        const { dealerId } = query;
        const where: any = { status: 'AVAILABLE' };

        if (dealerId && dealerId !== 'all') {
            where.lineItem = { inward: { dealerId } };
        }

        if (branchIds && branchIds.length > 0 && !branchIds.includes('ALL')) {
            where.lineItem = {
                ...(where.lineItem || {}),
                inward: {
                    ...(where.lineItem?.inward || {}),
                    branchId: { in: branchIds }
                }
            };
        }

        const total = await (prisma as any).individualVehicle.count({ where });

        // Fetch all to group by category efficiently
        const allAvailable = await (prisma as any).individualVehicle.findMany({
            where,
            include: { lineItem: { include: { vehicleMaster: true } } }
        });

        const catMap: Record<string, number> = {};
        allAvailable.forEach((v: any) => {
            const cat = v.lineItem?.vehicleMaster?.category || 'UNKNOWN';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });

        const dealerCounts = await (prisma as any).individualVehicle.groupBy({
            by: ['status'], // placeholder
            where
        });

        // Get count per dealer
        const dealers = await (prisma as any).dealer.findMany();
        const dealerStats = await Promise.all(dealers.map(async (d: any) => {
            const dealerWhere: any = {
                status: 'AVAILABLE',
                lineItem: { inward: { dealerId: d.id } }
            };
            if (branchIds && branchIds.length > 0 && !branchIds.includes('ALL')) {
                dealerWhere.lineItem.inward.branchId = { in: branchIds };
            }

            const count = await (prisma as any).individualVehicle.count({
                where: dealerWhere
            });
            return { name: d.name, id: d.id, count };
        }));

        return {
            total,
            categoryWise: Object.entries(catMap).map(([name, count]) => ({ name, count })),
            dealerWise: dealerStats
        };
    }
}
