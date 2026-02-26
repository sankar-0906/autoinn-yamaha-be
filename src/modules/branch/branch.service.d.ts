export declare class BranchService {
    static createBranch(data: any, userId?: string): Promise<{
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
    }>;
    static getAllBranches(query: any): Promise<{
        branches: ({
            address: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                line1: string | null;
                line2: string | null;
                line3: string | null;
                locality: string | null;
                cityId: string | null;
                stateId: string | null;
                countryId: string | null;
                pincode: string | null;
            } | null;
            company: {
                id: string;
                email: string | null;
                phone: string | null;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                addressId: string | null;
                cin: string | null;
                pan: string | null;
                logo: string | null;
                website: string | null;
                contactPerson: string | null;
            } | null;
        } & {
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
        })[];
        total: number;
        page: any;
        limit: any;
    }>;
    static getBranchById(id: string): Promise<({
        address: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            line1: string | null;
            line2: string | null;
            line3: string | null;
            locality: string | null;
            cityId: string | null;
            stateId: string | null;
            countryId: string | null;
            pincode: string | null;
        } | null;
        company: {
            id: string;
            email: string | null;
            phone: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            addressId: string | null;
            cin: string | null;
            pan: string | null;
            logo: string | null;
            website: string | null;
            contactPerson: string | null;
        } | null;
        contacts: {
            id: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string | null;
            category: string | null;
        }[];
    } & {
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
    }) | null>;
    static updateBranch(id: string, data: any): Promise<{
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
    }>;
    static deleteBranch(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=branch.service.d.ts.map