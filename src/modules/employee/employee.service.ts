import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';

export class EmployeeService {
    static async getAll() {
        return prisma.user.findMany({
            where: { employee: true },
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

        return prisma.user.create({
            data: {
                ...rest,
                password: hashedPassword,
                employee: true,
                profile: {
                    create: {
                        employeeName,
                        fatherName,
                        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                        bloodGroup,
                        aadhaarNumber,
                        panNumber,
                        drivingLicense,
                        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,
                        department: departmentId ? { connect: { id: departmentId } } : undefined,
                        branch: branchId ? { connect: { id: branchId } } : undefined,
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
                branch: branchId ? { set: { id: branchId } } : undefined,
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
