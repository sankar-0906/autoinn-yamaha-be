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
        departmentId: string | null;
        master: string | null;
        subModule: string | null;
        accessId: string | null;
    }>;
    static getAll(departmentId?: string): Promise<({
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
        departmentId: string | null;
        master: string | null;
        subModule: string | null;
        accessId: string | null;
    })[]>;
    static getById(id: string): Promise<({
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
        departmentId: string | null;
        master: string | null;
        subModule: string | null;
        accessId: string | null;
    }) | null>;
    static delete(id: string): Promise<{
        deleted: boolean;
    }>;
}
//# sourceMappingURL=roleAccess.service.d.ts.map