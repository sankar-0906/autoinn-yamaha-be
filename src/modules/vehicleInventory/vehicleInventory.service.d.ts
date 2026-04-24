export declare class VehicleInventoryService {
    static getSummary(query: any): Promise<any[]>;
    static getDetails(query: any): Promise<any>;
    static getCounts(query: any): Promise<{
        total: any;
        categoryWise: {
            name: string;
            count: number;
        }[];
        dealerWise: any[];
    }>;
}
//# sourceMappingURL=vehicleInventory.service.d.ts.map