export declare class CompanyService {
    static getAll(): Promise<({
        address: ({
            district: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                stateId: string;
            } | null;
            country: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sortName: string;
                phoneCode: string | null;
            } | null;
            state: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                countryId: string;
            } | null;
        } & {
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
        }) | null;
        branches: {
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
        }[];
    } & {
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
    })[]>;
    static getById(id: string): Promise<({
        address: ({
            district: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                stateId: string;
            } | null;
            country: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sortName: string;
                phoneCode: string | null;
            } | null;
            state: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                countryId: string;
            } | null;
        } & {
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
        }) | null;
        branches: {
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
        }[];
    } & {
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
    }) | null>;
    static create(data: any, createdById?: string): Promise<{
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
    } & {
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
    }>;
    static update(id: string, data: any): Promise<{
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
    } & {
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
    }>;
    static delete(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=company.service.d.ts.map