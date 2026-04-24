export declare class RoleAccessService {
    static create(data: {
        master: string;
        subModule: string;
        departmentId: string;
        access: {
            create?: boolean;
            update?: boolean;
            delete?: boolean;
            read?: boolean;
            print?: boolean;
        };
    }): Promise<{
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
    }>;
    static getAll(departmentId?: string): Promise<({
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
    })[]>;
    static getById(id: string): Promise<({
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
    }) | null>;
    static delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=roleAccess.service.d.ts.map