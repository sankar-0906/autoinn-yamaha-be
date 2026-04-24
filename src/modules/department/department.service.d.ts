export declare class DepartmentService {
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
        _count: {
            employeeProfiles: number;
        };
        roleAccess: ({
            access: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                create: boolean | null;
                update: boolean | null;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            subModule: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            master: string | null;
            accessId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        departmentType: string[];
        othersAccess: boolean | null;
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
        _count: {
            employeeProfiles: number;
        };
        roleAccess: ({
            access: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                create: boolean | null;
                update: boolean | null;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            subModule: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            master: string | null;
            accessId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        departmentType: string[];
        othersAccess: boolean | null;
    }) | null>;
    static create(data: any): Promise<{
        roleAccess: ({
            access: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                create: boolean | null;
                update: boolean | null;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            subModule: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            master: string | null;
            accessId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        departmentType: string[];
        othersAccess: boolean | null;
    }>;
    static update(id: string, data: any): Promise<{
        roleAccess: ({
            access: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                create: boolean | null;
                update: boolean | null;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            subModule: string | null;
            createdAt: Date;
            updatedAt: Date;
            departmentId: string | null;
            master: string | null;
            accessId: string | null;
        })[];
    } & {
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        departmentType: string[];
        othersAccess: boolean | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: string;
        departmentType: string[];
        othersAccess: boolean | null;
    }>;
}
//# sourceMappingURL=department.service.d.ts.map