import prisma from '../../utils/prisma.js';
export class VehicleInventoryService {
    static async getSummary(query) {
        const { dealerId, category } = query;
        const where = {
            status: 'AVAILABLE'
        };
        if (dealerId && dealerId !== 'all') {
            where.lineItem = {
                inward: {
                    dealerId: dealerId
                }
            };
        }
        const vehicles = await prisma.individualVehicle.findMany({
            where,
            include: {
                lineItem: {
                    include: {
                        vehicleMaster: true,
                        inward: {
                            include: { dealer: true }
                        }
                    }
                },
                image: true
            }
        });
        // Filter by category in JS to avoid deep nesting complexities in prisma for now
        let filteredVehicles = vehicles;
        if (category && category !== 'all') {
            filteredVehicles = vehicles.filter((v) => v.lineItem?.vehicleMaster?.category === category);
        }
        // Aggregation logic
        const groups = {};
        filteredVehicles.forEach((v) => {
            const master = v.lineItem?.vehicleMaster;
            if (!master)
                return;
            const dealer = v.lineItem?.inward?.dealer;
            const dealerIdKey = dealer?.id || 'UNKNOWN';
            const colorCode = v.colorCode || 'UNKNOWN';
            const key = `${master.id}_${colorCode}_${dealerIdKey}`;
            if (!groups[key]) {
                groups[key] = {
                    key,
                    modelName: master.modelName,
                    modelId: master.id,
                    modelCode: master.modelCode,
                    category: master.category,
                    color: v.image?.color || v.colorCode || 'UNKNOWN',
                    colorCode: v.colorCode,
                    dealerName: dealer?.name || 'UNKNOWN',
                    dealerId: dealer?.id || 'all',
                    quantity: 0,
                    imageUrl: v.image?.url || null
                };
            }
            groups[key].quantity += 1;
        });
        return Object.values(groups).sort((a, b) => a.modelName.localeCompare(b.modelName));
    }
    static async getDetails(query) {
        const { modelId, colorCode, dealerId } = query;
        if (!modelId)
            throw new Error("modelId is required");
        const where = {
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
                dealerId: dealerId
            };
        }
        return await prisma.individualVehicle.findMany({
            where,
            include: {
                lineItem: {
                    include: {
                        vehicleMaster: true,
                        inward: {
                            include: { dealer: true }
                        }
                    }
                },
                image: true
            },
            orderBy: { mfgDate: 'asc' }
        });
    }
    static async getCounts(query) {
        const { dealerId } = query;
        const where = { status: 'AVAILABLE' };
        if (dealerId && dealerId !== 'all') {
            where.lineItem = { inward: { dealerId } };
        }
        const total = await prisma.individualVehicle.count({ where });
        // Fetch all to group by category efficiently
        const allAvailable = await prisma.individualVehicle.findMany({
            where,
            include: { lineItem: { include: { vehicleMaster: true } } }
        });
        const catMap = {};
        allAvailable.forEach((v) => {
            const cat = v.lineItem?.vehicleMaster?.category || 'UNKNOWN';
            catMap[cat] = (catMap[cat] || 0) + 1;
        });
        const dealerCounts = await prisma.individualVehicle.groupBy({
            by: ['status'], // placeholder
            where
        });
        // Get count per dealer
        const dealers = await prisma.dealer.findMany();
        const dealerStats = await Promise.all(dealers.map(async (d) => {
            const count = await prisma.individualVehicle.count({
                where: {
                    status: 'AVAILABLE',
                    lineItem: { inward: { dealerId: d.id } }
                }
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
