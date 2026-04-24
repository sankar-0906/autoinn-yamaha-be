export declare class BranchService {
    static getAllBranches(params: {
        page?: number;
        size?: number;
        searchString?: string;
    }): Promise<{
        branch: {
            count: number;
            inactiveCount: number;
            totalCount: number;
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
            }[];
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
            contacts: {
                id: string;
                branchId: string | null;
                createdAt: Date;
                updatedAt: Date;
                category: string | null;
                phone: string | null;
            }[];
            personInCharge: ({
                profile: {
                    id: string;
                    createdById: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    addressId: string | null;
                    bankDetailsId: string | null;
                    bloodGroup: string | null;
                    dateOfBirth: Date | null;
                    dateOfJoining: Date | null;
                    departmentId: string | null;
                    employeeId: string | null;
                    employeeName: string | null;
                    fatherName: string | null;
                    aadhaarNumber: string | null;
                    drivingLicense: string | null;
                    panNumber: string | null;
                } | null;
            } & {
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
            })[];
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
        }[];
        count: number;
    }>;
    private static getCountsForBranch;
    static getBranchById(id: string): Promise<{
        count: number;
        inactiveCount: number;
        totalCount: number;
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
        }[];
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
        contacts: {
            id: string;
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            phone: string | null;
        }[];
        personInCharge: ({
            profile: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                addressId: string | null;
                bankDetailsId: string | null;
                bloodGroup: string | null;
                dateOfBirth: Date | null;
                dateOfJoining: Date | null;
                departmentId: string | null;
                employeeId: string | null;
                employeeName: string | null;
                fatherName: string | null;
                aadhaarNumber: string | null;
                drivingLicense: string | null;
                panNumber: string | null;
            } | null;
        } & {
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
        })[];
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
    } | null>;
    static createBranch(data: any, userId?: string): Promise<{
        count: number;
        inactiveCount: number;
        totalCount: number;
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
    }>;
    static updateBranch(id: string, data: any, userId?: string): Promise<{
        count: number;
        inactiveCount: number;
        totalCount: number;
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
    }>;
    static deleteBranch(id: string): Promise<{
        code: number;
        message: string;
    }>;
}
//# sourceMappingURL=branch.service.d.ts.map