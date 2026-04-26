import prisma from '../../utils/prisma.js';

export class DepartmentService {
    static async getAll(query: any = {}) {
        const { page = 1, limit = 10, search = '', searchString = '' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');

        const where: any = {};
        if (effectiveSearch) {
            where.role = { contains: effectiveSearch, mode: 'insensitive' };
        }

        const [departments, total] = await Promise.all([
            prisma.department.findMany({
                where,
                skip,
                take,
                include: {
                    roleAccess: { include: { access: true } },
                    createdBy: true,
                    _count: {
                        select: { employeeProfiles: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.department.count({ where })
        ]);

        return { departments, total, page: Number(page), limit: take };
    }

    static async getById(id: string) {
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

    static async create(data: any) {
        const { role, roleAccess, ...rest } = data;

        const roleAccessCreate = roleAccess?.map((ra: any) => ({
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

        const existing = await prisma.department.findUnique({
            where: { role }
        });

        if (existing) {
            throw new Error('Role already exists');
        }

        const createDepartment = await prisma.department.create({
            data: {
                role,
                ...rest,
                roleAccess: roleAccessCreate ? { create: roleAccessCreate } : undefined
            },
            include: { roleAccess: { include: { access: true } } },
        });

        return createDepartment;
    }

    static async update(id: string, data: any) {
        const { roleAccess, ...rest } = data;

        const roleAccessUpdate = roleAccess?.map((ra: any) => ({
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

    static async delete(id: string) {
        return prisma.department.delete({
            where: { id }
        });
    }
}
