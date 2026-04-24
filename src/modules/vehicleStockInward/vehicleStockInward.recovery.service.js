import { prisma } from '../../utils/prisma.js';
export class VehicleDataRecoveryService {
    /**
     * Recover model code from chassis number by looking up existing vehicle masters
     * This is dynamic - no hardcoded patterns
     */
    static async recoverModelCodeFromChassis(chassisNo) {
        if (!chassisNo)
            return null;
        try {
            // Look for any vehicle master records that might match this chassis pattern
            // We'll search for partial matches in existing data
            const existingVehicles = await prisma.vehicleStockItem.findMany({
                where: {
                    chassisNo: {
                        contains: chassisNo.substring(0, 8), // Match first 8 characters
                        mode: 'insensitive'
                    }
                },
                include: {
                    vehicleMaster: true
                },
                take: 5 // Limit to avoid performance issues
            });
            if (existingVehicles.length > 0) {
                // Find the most common model code among matches
                const modelCodes = existingVehicles
                    .map(v => v.vehicleMaster?.modelCode)
                    .filter(Boolean);
                if (modelCodes.length > 0) {
                    // Return the most frequent model code
                    const frequency = {};
                    modelCodes.forEach(code => {
                        if (code)
                            frequency[code] = (frequency[code] || 0) + 1;
                    });
                    const mostFrequent = Object.entries(frequency)
                        .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
                    console.log(`[RECOVERY] Model code recovered for ${chassisNo}: ${mostFrequent}`);
                    return mostFrequent;
                }
            }
            // Fallback: try to find any vehicle master with similar naming pattern
            const allVehicleMasters = await prisma.vehicleMaster.findMany({
                where: {
                    OR: [
                        { modelCode: { contains: chassisNo.substring(0, 6), mode: 'insensitive' } },
                        { modelName: { contains: chassisNo.substring(0, 6), mode: 'insensitive' } }
                    ]
                },
                take: 3
            });
            if (allVehicleMasters.length > 0) {
                console.log(`[RECOVERY] Fallback model code for ${chassisNo}: ${allVehicleMasters[0].modelCode}`);
                return allVehicleMasters[0].modelCode || null;
            }
        }
        catch (error) {
            console.error(`[RECOVERY] Error recovering model code for ${chassisNo}:`, error);
        }
        return null;
    }
    /**
     * Recover color code from chassis number by looking up existing records
     */
    static async recoverColorCodeFromChassis(chassisNo) {
        if (!chassisNo)
            return null;
        try {
            // Look for existing vehicles with similar chassis patterns
            const existingVehicles = await prisma.vehicleStockItem.findMany({
                where: {
                    chassisNo: {
                        contains: chassisNo.substring(0, 8),
                        mode: 'insensitive'
                    }
                },
                include: {
                    image: true
                },
                take: 5
            });
            if (existingVehicles.length > 0) {
                // Find the most common color code among matches
                const colorCodes = existingVehicles
                    .map(v => v.image?.code)
                    .filter(Boolean);
                if (colorCodes.length > 0) {
                    const frequency = {};
                    colorCodes.forEach(code => {
                        if (code)
                            frequency[code] = (frequency[code] || 0) + 1;
                    });
                    const mostFrequent = Object.entries(frequency)
                        .sort(([, a], [, b]) => b - a)[0]?.[0] || null;
                    console.log(`[RECOVERY] Color code recovered for ${chassisNo}: ${mostFrequent}`);
                    return mostFrequent;
                }
            }
            // Fallback: extract potential color from chassis pattern
            const colorPattern = chassisNo.match(/([A-Z0-9]{2,4})$/);
            if (colorPattern) {
                const potentialColor = colorPattern[1];
                console.log(`[RECOVERY] Extracted potential color for ${chassisNo}: ${potentialColor}`);
                return potentialColor || null;
            }
        }
        catch (error) {
            console.error(`[RECOVERY] Error recovering color code for ${chassisNo}:`, error);
        }
        return null;
    }
    /**
     * Batch recover missing data for multiple vehicles
     */
    static async batchRecoverVehicleData(vehicles) {
        const recovered = await Promise.all(vehicles.map(async (vehicle) => {
            const [modelCode, colorCode] = await Promise.all([
                this.recoverModelCodeFromChassis(vehicle.chassisNo || ''),
                this.recoverColorCodeFromChassis(vehicle.chassisNo || '')
            ]);
            return {
                ...vehicle,
                modelCode: modelCode || 'UNKNOWN',
                colorCode: colorCode || 'UNKNOWN'
            };
        }));
        return recovered;
    }
}
//# sourceMappingURL=vehicleStockInward.recovery.service.js.map