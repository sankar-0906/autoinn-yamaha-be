export declare class DealerService {
    static getAll(): Promise<({
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
            branchId: string | null;
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
            dealerShippingId: string | null;
        }) | null;
        shippingAddresses: ({
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
            branchId: string | null;
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
            dealerShippingId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        status: string | null;
        email: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    })[]>;
    static getById(id: string): Promise<({
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
            branchId: string | null;
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
            dealerShippingId: string | null;
        }) | null;
        shippingAddresses: ({
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
            branchId: string | null;
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
            dealerShippingId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        status: string | null;
        email: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }) | null>;
    static create(data: any): Promise<{
        address: {
            id: string;
            branchId: string | null;
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
            dealerShippingId: string | null;
        } | null;
        shippingAddresses: {
            id: string;
            branchId: string | null;
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
            dealerShippingId: string | null;
        }[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        status: string | null;
        email: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }>;
    static update(id: string, data: any): Promise<({
        address: {
            id: string;
            branchId: string | null;
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
            dealerShippingId: string | null;
        } | null;
        shippingAddresses: ({
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
        } & {
            id: string;
            branchId: string | null;
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
            dealerShippingId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        status: string | null;
        email: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }) | null>;
    static delete(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        status: string | null;
        email: string | null;
        addressId: string | null;
        remarks: string | null;
        dealerType: string | null;
        GSTIN: string | null;
    }>;
}
//# sourceMappingURL=dealer.service.d.ts.map