export declare class FrameNumberService {
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
        manufacturer: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            code: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            logo: string | null;
            vehicleManufacturer: boolean | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        position: number | null;
        inputValue: string | null;
        inferredField: string | null;
        targetValue: string | null;
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
        manufacturer: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            code: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            logo: string | null;
            vehicleManufacturer: boolean | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        position: number | null;
        inputValue: string | null;
        inferredField: string | null;
        targetValue: string | null;
    }) | null>;
    static create(data: any): Promise<{
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
        manufacturer: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            code: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            logo: string | null;
            vehicleManufacturer: boolean | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        position: number | null;
        inputValue: string | null;
        inferredField: string | null;
        targetValue: string | null;
    }>;
    static update(id: string, data: any): Promise<{
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
        manufacturer: {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            code: string | null;
            email: string | null;
            addressId: string | null;
            gst: string | null;
            logo: string | null;
            vehicleManufacturer: boolean | null;
        } | null;
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        position: number | null;
        inputValue: string | null;
        inferredField: string | null;
        targetValue: string | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        manufacturerId: string | null;
        position: number | null;
        inputValue: string | null;
        inferredField: string | null;
        targetValue: string | null;
    }>;
    static decodeChassisNo(chassisNo: string, manufacturerId: string): Promise<Date | null>;
}
//# sourceMappingURL=frameNumber.service.d.ts.map