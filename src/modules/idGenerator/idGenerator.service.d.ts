export declare class IdGeneratorService {
    static getAll(): Promise<({
        branch: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            url: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            companyId: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            googleMapUrl: string | null;
        } | null;
        createdBy: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            phone2: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            email: string | null;
            verified: boolean | null;
            lastLoginAt: Date | null;
        } | null;
    } & {
        id: string;
        subModule: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        branchId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        module: string | null;
    })[]>;
    static getById(id: string): Promise<({
        branch: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            url: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            companyId: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            googleMapUrl: string | null;
        } | null;
        createdBy: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            phone2: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            email: string | null;
            verified: boolean | null;
            lastLoginAt: Date | null;
        } | null;
    } & {
        id: string;
        subModule: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        branchId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        module: string | null;
    }) | null>;
    static create(data: any): Promise<{
        branch: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            url: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            companyId: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            googleMapUrl: string | null;
        } | null;
        createdBy: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            phone2: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            email: string | null;
            verified: boolean | null;
            lastLoginAt: Date | null;
        } | null;
    } & {
        id: string;
        subModule: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        branchId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        module: string | null;
    }>;
    static update(id: string, data: any): Promise<{
        branch: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            url: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            companyId: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            googleMapUrl: string | null;
        } | null;
        createdBy: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            phone2: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            email: string | null;
            verified: boolean | null;
            lastLoginAt: Date | null;
        } | null;
    } & {
        id: string;
        subModule: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        branchId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        module: string | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        subModule: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        branchId: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        module: string | null;
    }>;
    static generateNextId(subModule: string, branchId?: string): Promise<string | null>;
}
//# sourceMappingURL=idGenerator.service.d.ts.map