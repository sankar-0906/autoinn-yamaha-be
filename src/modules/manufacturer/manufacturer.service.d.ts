export declare class ManufacturerService {
    static getAll(): Promise<({
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
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        gst: string | null;
        logo: string | null;
        code: string | null;
        vehicleManufacturer: boolean | null;
    })[]>;
    static getById(id: string): Promise<({
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
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        gst: string | null;
        logo: string | null;
        code: string | null;
        vehicleManufacturer: boolean | null;
    }) | null>;
    static create(data: any): Promise<{
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
    } & {
        id: string;
        email: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        gst: string | null;
        logo: string | null;
        code: string | null;
        vehicleManufacturer: boolean | null;
    }>;
    static update(id: string, data: any): Promise<{
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
    } & {
        id: string;
        email: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        gst: string | null;
        logo: string | null;
        code: string | null;
        vehicleManufacturer: boolean | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        email: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        addressId: string | null;
        gst: string | null;
        logo: string | null;
        code: string | null;
        vehicleManufacturer: boolean | null;
    }>;
}
//# sourceMappingURL=manufacturer.service.d.ts.map