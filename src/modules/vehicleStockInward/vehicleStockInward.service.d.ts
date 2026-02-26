export declare class VehicleStockInwardService {
    static processPdf(filePath: string): Promise<{
        dealerName: string;
        address: string;
        invoiceNo: string;
        date: string;
        placeOfSupply: string;
        daNumber: string;
        daDate: string;
        modeOfTransport: string;
        transporter: string;
        policyNumber: string;
        vehicleNo: string;
        from: string;
        to: string;
        insuranceCo: string;
        vehicles: any[];
    }>;
    private static parseExtractedText;
    static create(data: any, createdById?: string, branchId?: string): Promise<any>;
    static getAll(query: any): Promise<any>;
    static getById(id: string): Promise<any>;
}
//# sourceMappingURL=vehicleStockInward.service.d.ts.map