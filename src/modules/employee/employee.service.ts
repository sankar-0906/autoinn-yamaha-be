import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';
import { IdGeneratorService } from '../idGenerator/idGenerator.service.js';

export class EmployeeService {
    static async getAll(query: any = {}) {
        const { page = 1, limit = 10, search = '', searchString = '', activeTab = 'active' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        const effectiveSearch = String(search || searchString || '');

        const status = activeTab === 'active';

        const where: any = {
            employee: true,
            status: status
        };

        if (effectiveSearch) {
            where.OR = [
                { profile: { employeeName: { contains: effectiveSearch, mode: 'insensitive' } } },
                { phone: { contains: effectiveSearch } }
            ];
        }

        const [employees, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                include: {
                    profile: {
                        include: {
                            department: true,
                            branch: true,
                            bankDetails: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ]);

        return { employees, total, page: Number(page), limit: take };
    }

    static async getCount() {
        return prisma.user.count({
            where: { employee: true }
        });
    }

    static async getById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            include: {
                profile: {
                    include: {
                        department: true,
                        branch: true,
                        bankDetails: true
                    }
                }
            }
        });
    }

    static async create(data: any) {
        const {
            password,
            employeeName,
            fatherName,
            dateOfBirth,
            bloodGroup,
            departmentId,
            branchId,
            aadhaarNumber,
            panNumber,
            drivingLicense,
            dateOfJoining,
            ifscCode,
            accountNumber,
            accountHolder,
            bankName,
            ...rest
        } = data;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate employee ID using IdGenerator
        const mainBranchId = (branchId && branchId.length > 0) ? branchId[0] : undefined;
        const generatedEmployeeId = await IdGeneratorService.generateNextId('EMPLOYEE', mainBranchId);

        return prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
                employee: true,
                profile: {
                    create: {
                        employeeName,
                        employeeId: generatedEmployeeId,
                        fatherName,
                        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                        bloodGroup,
                        aadhaarNumber,
                        panNumber,
                        drivingLicense,
                        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
                        department: departmentId ? { connect: { id: departmentId } } : undefined,
                        branch: (branchId && branchId.length > 0) ? { connect: branchId.map((id: string) => ({ id })) } : undefined,
                        bankDetails: (ifscCode || accountNumber || accountHolder || bankName) ? {
                            create: {
                                ifsc: ifscCode,
                                accountNumber,
                                accountName: accountHolder,
                                name: bankName
                            }
                        } : undefined
                    },
                },
            },
            include: {
                profile: {
                    include: {
                        department: true,
                        branch: true,
                        bankDetails: true
                    }
                }
            },
        });
    }

    static async update(id: string, data: any) {
        const {
            password,
            employeeName,
            fatherName,
            dateOfBirth,
            bloodGroup,
            departmentId,
            branchId,
            aadhaarNumber,
            panNumber,
            drivingLicense,
            dateOfJoining,
            ifscCode,
            accountNumber,
            accountHolder,
            bankName,
            ...rest
        } = data;

        const updateData: any = { ...rest };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Handle profile update
        updateData.profile = {
            update: {
                employeeName,
                fatherName,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                bloodGroup,
                aadhaarNumber,
                panNumber,
                drivingLicense,
                dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
                department: departmentId ? { connect: { id: departmentId } } : undefined,
                branch: branchId ? { set: branchId.map((id: string) => ({ id })) } : undefined,
                bankDetails: (ifscCode || accountNumber || accountHolder || bankName) ? {
                    upsert: {
                        create: {
                            ifsc: ifscCode,
                            accountNumber,
                            accountName: accountHolder,
                            name: bankName
                        },
                        update: {
                            ifsc: ifscCode,
                            accountNumber,
                            accountName: accountHolder,
                            name: bankName
                        }
                    }
                } : undefined
            }
        };

        return prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                profile: {
                    include: {
                        department: true,
                        branch: true,
                        bankDetails: true
                    }
                }
            }
        });
    }

    static async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }
}
