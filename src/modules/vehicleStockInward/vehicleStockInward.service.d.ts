interface VehicleRow {
    modelCode: string;
    productName: string | null;
    qty: number;
    chassisNo: string | null;
    engineNo: string | null;
    colorCode: string | null;
}
interface ExtractedInward {
    'NAME': string | null;
    'ADDRESS': string | null;
    'ADDRESS OF DELIVERY': string | null;
    'INVOICE NO': string | null;
    'DATE': string | null;
    'PLACE OF SUPPLY': string | null;
    'DA NUMBER': string | null;
    'DA DATE': string | null;
    'MODE OF DISPATCH': string | null;
    'TRANSPORTER': string | null;
    'FROM': string | null;
    'TO': string | null;
    'INSURANCE CO': string | null;
    'POLICY NO': string | null;
    'VEHICLE NO': string | null;
    'VEHICLES': VehicleRow[];
}
export declare class VehicleStockInwardService {
    static processPdf(filePath: string): Promise<ExtractedInward>;
    private static extractTextWithOCR;
    private static extractDataFromText;
    private static extractVehicleTable;
    private static extractVehicleTableAlternative;
    static create(data: any, createdById?: string, branchId?: string): Promise<any>;
    static getAll(query: any): Promise<any>;
    static getById(id: string): Promise<any>;
    static update(id: string, data: any): Promise<any>;
    static delete(id: string): Promise<any>;
}
export {};
//# sourceMappingURL=vehicleStockInward.service.d.ts.map