export declare class IdGeneratorService {
    static getAll(): Promise<({
        createdBy: {
            id: string;
            phone2: string | null;
            email: string | null;
            phone: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            verified: boolean | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        } | null;
        branch: {
            url: string | null;
            id: string;
            email: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            addressId: string | null;
            branchType: string | null;
            gst: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            companyId: string | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        subModule: string | null;
        branchId: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        module: string | null;
    })[]>;
    static getById(id: string): Promise<({
        createdBy: {
            id: string;
            phone2: string | null;
            email: string | null;
            phone: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            verified: boolean | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        } | null;
        branch: {
            url: string | null;
            id: string;
            email: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            addressId: string | null;
            branchType: string | null;
            gst: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            companyId: string | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        subModule: string | null;
        branchId: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        module: string | null;
    }) | null>;
    static create(data: any): Promise<{
        createdBy: {
            id: string;
            phone2: string | null;
            email: string | null;
            phone: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            verified: boolean | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        } | null;
        branch: {
            url: string | null;
            id: string;
            email: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            addressId: string | null;
            branchType: string | null;
            gst: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            companyId: string | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        subModule: string | null;
        branchId: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        module: string | null;
    }>;
    static update(id: string, data: any): Promise<{
        createdBy: {
            id: string;
            phone2: string | null;
            email: string | null;
            phone: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            verified: boolean | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        } | null;
        branch: {
            url: string | null;
            id: string;
            email: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            addressId: string | null;
            branchType: string | null;
            gst: string | null;
            senderId: string | null;
            lat: number | null;
            lon: number | null;
            companyId: string | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        subModule: string | null;
        branchId: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        module: string | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        subModule: string | null;
        branchId: string | null;
        text: string | null;
        startCount: string | null;
        count: string | null;
        scope: string | null;
        resetAnnually: boolean | null;
        module: string | null;
    }>;
}
//# sourceMappingURL=idGenerator.service.d.ts.map