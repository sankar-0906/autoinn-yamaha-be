import prisma from '../../utils/prisma.js';

export class RoleAccessService {
    static async create(data: {
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
    }) {
        // Create Access record first, then RoleAccess linked to it
        return prisma.roleAccess.create({
            data: {
                master: data.master,
                subModule: data.subModule,
                department: { connect: { id: data.departmentId } },
                access: {
                    create: {
                        create: data.access.create ?? false,
                        update: data.access.update ?? false,
                        delete: data.access.delete ?? false,
                        read: data.access.read ?? false,
                        print: data.access.print ?? false,
                    },
                },
            },
            include: { access: true },
        });
    }

    static async getAll(departmentId?: string) {
        return prisma.roleAccess.findMany({
            ...(departmentId ? { where: { departmentId } } : {}),
            include: { access: true },
        });
    }

    static async getById(id: string) {
        return prisma.roleAccess.findUnique({
            where: { id },
            include: { access: true },
        });
    }

    static async delete(id: string) {
        // Delete RoleAccess (Access will cascade via relation)
        const ra = await prisma.roleAccess.findUnique({ where: { id }, include: { access: true } });
        await prisma.roleAccess.delete({ where: { id } });
        if (ra?.accessId) {
            await prisma.access.delete({ where: { id: ra.accessId } }).catch(() => null);
        }
        return { deleted: true };
    }
}
