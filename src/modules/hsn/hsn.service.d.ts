export declare class HsnService {
    static createHsn(data: any, userId?: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        igst: number | null;
        cgst: number | null;
        sgst: number | null;
        cess: number | null;
        description: string | null;
    }>;
    static getAllHsns(query: any): Promise<{
        hsns: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            code: string | null;
            igst: number | null;
            cgst: number | null;
            sgst: number | null;
            cess: number | null;
            description: string | null;
        }[];
        total: number;
        page: any;
        limit: number;
    }>;
    static getHsnById(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        igst: number | null;
        cgst: number | null;
        sgst: number | null;
        cess: number | null;
        description: string | null;
    } | null>;
    static updateHsn(id: string, data: any): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        igst: number | null;
        cgst: number | null;
        sgst: number | null;
        cess: number | null;
        description: string | null;
    }>;
    static deleteHsn(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        code: string | null;
        igst: number | null;
        cgst: number | null;
        sgst: number | null;
        cess: number | null;
        description: string | null;
    }>;
}
//# sourceMappingURL=hsn.service.d.ts.map