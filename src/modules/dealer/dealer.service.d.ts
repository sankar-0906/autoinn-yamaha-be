export declare class DealerService {
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
        shippingAddress: {
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
        }[];
    } & {
        id: string;
        email: string | null;
        status: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
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
        shippingAddress: {
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
        }[];
    } & {
        id: string;
        email: string | null;
        status: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }) | null>;
    static create(data: any): Promise<{
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
        shippingAddress: {
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
        }[];
    } & {
        id: string;
        email: string | null;
        status: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }>;
    static update(id: string, data: any): Promise<({
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
        shippingAddress: {
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
        }[];
    } & {
        id: string;
        email: string | null;
        status: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }) | null>;
    static delete(id: string): Promise<{
        id: string;
        email: string | null;
        status: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }>;
}
//# sourceMappingURL=dealer.service.d.ts.map