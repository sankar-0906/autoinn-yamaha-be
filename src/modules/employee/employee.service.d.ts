export declare class EmployeeService {
    static getAll(): Promise<({
        profile: ({
            department: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: string;
                departmentType: string[];
                othersAccess: boolean | null;
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
            }[];
            bankDetails: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                accountNumber: string | null;
                accountName: string | null;
                ifsc: string | null;
                accountType: import("@prisma/client").$Enums.AccType | null;
                accountBalance: number;
            } | null;
        } & {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            employeeName: string | null;
            fatherName: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            aadhaarNumber: string | null;
            panNumber: string | null;
            drivingLicense: string | null;
            dateOfJoining: Date | null;
            employeeId: string | null;
            addressId: string | null;
            bankDetailsId: string | null;
            userId: string;
        }) | null;
    } & {
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
    })[]>;
    static getCount(): Promise<number>;
    static getById(id: string): Promise<({
        profile: ({
            department: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: string;
                departmentType: string[];
                othersAccess: boolean | null;
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
            }[];
            bankDetails: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                accountNumber: string | null;
                accountName: string | null;
                ifsc: string | null;
                accountType: import("@prisma/client").$Enums.AccType | null;
                accountBalance: number;
            } | null;
        } & {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            employeeName: string | null;
            fatherName: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            aadhaarNumber: string | null;
            panNumber: string | null;
            drivingLicense: string | null;
            dateOfJoining: Date | null;
            employeeId: string | null;
            addressId: string | null;
            bankDetailsId: string | null;
            userId: string;
        }) | null;
    } & {
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
    }) | null>;
    static create(data: any): Promise<{
        profile: ({
            department: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: string;
                departmentType: string[];
                othersAccess: boolean | null;
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
            }[];
            bankDetails: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                accountNumber: string | null;
                accountName: string | null;
                ifsc: string | null;
                accountType: import("@prisma/client").$Enums.AccType | null;
                accountBalance: number;
            } | null;
        } & {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            employeeName: string | null;
            fatherName: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            aadhaarNumber: string | null;
            panNumber: string | null;
            drivingLicense: string | null;
            dateOfJoining: Date | null;
            employeeId: string | null;
            addressId: string | null;
            bankDetailsId: string | null;
            userId: string;
        }) | null;
    } & {
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
    }>;
    static update(id: string, data: any): Promise<{
        profile: ({
            department: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                role: string;
                departmentType: string[];
                othersAccess: boolean | null;
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
            }[];
            bankDetails: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                accountNumber: string | null;
                accountName: string | null;
                ifsc: string | null;
                accountType: import("@prisma/client").$Enums.AccType | null;
                accountBalance: number;
            } | null;
        } & {
            id: string;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            employeeName: string | null;
            fatherName: string | null;
            dateOfBirth: Date | null;
            bloodGroup: string | null;
            aadhaarNumber: string | null;
            panNumber: string | null;
            drivingLicense: string | null;
            dateOfJoining: Date | null;
            employeeId: string | null;
            addressId: string | null;
            bankDetailsId: string | null;
            userId: string;
        }) | null;
    } & {
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
    }>;
    static delete(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=employee.service.d.ts.map