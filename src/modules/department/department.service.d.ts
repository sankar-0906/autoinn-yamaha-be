export declare class DepartmentService {
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
        _count: {
            employeeProfiles: number;
        };
        roleAccess: ({
            access: {
                create: boolean | null;
                update: boolean | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            master: string | null;
            subModule: string | null;
            accessId: string | null;
            departmentId: string | null;
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
        _count: {
            employeeProfiles: number;
        };
        roleAccess: ({
            access: {
                create: boolean | null;
                update: boolean | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            master: string | null;
            subModule: string | null;
            accessId: string | null;
            departmentId: string | null;
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
                create: boolean | null;
                update: boolean | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            master: string | null;
            subModule: string | null;
            accessId: string | null;
            departmentId: string | null;
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
                create: boolean | null;
                update: boolean | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                delete: boolean | null;
                read: boolean | null;
                print: boolean | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            master: string | null;
            subModule: string | null;
            accessId: string | null;
            departmentId: string | null;
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