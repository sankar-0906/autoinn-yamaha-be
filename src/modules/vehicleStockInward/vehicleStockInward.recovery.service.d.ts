export declare class VehicleDataRecoveryService {
    /**
     * Recover model code from chassis number by looking up existing vehicle masters
     * This is dynamic - no hardcoded patterns
     */
    static recoverModelCodeFromChassis(chassisNo: string): Promise<string | null>;
    /**
     * Recover color code from chassis number by looking up existing records
     */
    static recoverColorCodeFromChassis(chassisNo: string): Promise<string | null>;
    /**
     * Batch recover missing data for multiple vehicles
     */
    static batchRecoverVehicleData(vehicles: Array<{
        chassisNo?: string;
    }>): Promise<{
        modelCode: string;
        colorCode: string;
        chassisNo?: string;
    }[]>;
}
//# sourceMappingURL=vehicleStockInward.recovery.service.d.ts.map