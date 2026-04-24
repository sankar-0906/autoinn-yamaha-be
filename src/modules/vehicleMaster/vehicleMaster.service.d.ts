export declare class VehicleMasterService {
    static getAll(): Promise<any[]>;
    private static transformResponse;
    static getById(id: string): Promise<any>;
    static create(data: any): Promise<any>;
    static update(id: string, data: any): Promise<any>;
    static delete(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        modelName: string;
        manufacturerId: string | null;
        modelCode: string | null;
        category: string | null;
        vehicleStatus: string | null;
        hsnId: string | null;
        noOfServices: number | null;
        serviceIntervalKm: number | null;
        serviceIntervalTime: number | null;
        warrentyPeriodKm: number | null;
        warrentyPeriodMonths: number | null;
    }>;
    static getUniqueModelCodes(): Promise<(string | null)[]>;
    static getColorsByModelCode(modelCode: string): Promise<{
        code: string | null;
        color: string | null;
    }[]>;
}
//# sourceMappingURL=vehicleMaster.service.d.ts.map