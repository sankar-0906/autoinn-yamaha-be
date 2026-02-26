import prisma from '../../utils/prisma.js';
export class DepartmentService {
    static async getAll() {
        return prisma.department.findMany({
            include: {
                roleAccess: { include: { access: true } },
                createdBy: true,
                _count: {
                    select: { employeeProfiles: true }
                }
            }
        });
    }
    static async getById(id) {
        return prisma.department.findUnique({
            where: { id },
            include: {
                roleAccess: { include: { access: true } },
                createdBy: true,
                _count: {
                    select: { employeeProfiles: true }
                }
            }
        });
    }
    static async create(data) {
        const { role, roleAccess, ...rest } = data;
        const roleAccessCreate = roleAccess?.map((ra) => ({
            master: ra.master,
            subModule: ra.subModule,
            access: {
                create: {
                    create: ra.access.create || false,
                    read: ra.access.read || false,
                    update: ra.access.update || false,
                    delete: ra.access.delete || false,
                    print: ra.access.print || false,
                }
            }
        }));
        return prisma.department.upsert({
            where: { role },
            create: {
                role,
                ...rest,
                roleAccess: roleAccessCreate ? { create: roleAccessCreate } : undefined
            },
            update: {
                ...rest,
                roleAccess: roleAccessCreate ? {
                    deleteMany: {},
                    create: roleAccessCreate
                } : undefined
            },
            include: { roleAccess: { include: { access: true } } },
        });
    }
    static async update(id, data) {
        const { roleAccess, ...rest } = data;
        const roleAccessUpdate = roleAccess?.map((ra) => ({
            master: ra.master,
            subModule: ra.subModule,
            access: {
                create: {
                    create: ra.access.create || false,
                    read: ra.access.read || false,
                    update: ra.access.update || false,
                    delete: ra.access.delete || false,
                    print: ra.access.print || false,
                }
            }
        }));
        return prisma.department.update({
            where: { id },
            data: {
                ...rest,
                roleAccess: roleAccessUpdate ? {
                    deleteMany: {},
                    create: roleAccessUpdate
                } : undefined
            },
            include: { roleAccess: { include: { access: true } } }
        });
    }
    static async delete(id) {
        return prisma.department.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=department.service.js.map