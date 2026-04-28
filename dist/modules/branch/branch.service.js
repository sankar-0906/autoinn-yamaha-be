import prisma from '../../utils/prisma.js';
export class BranchService {
    static async getAllBranches(params) {
        try {
            const { page = 1, size = 10, searchString = '' } = params;
            const skip = (Number(page) - 1) * Number(size);
            const where = searchString
                ? {
                    OR: [
                        { name: { contains: searchString, mode: 'insensitive' } },
                        { gst: { contains: searchString, mode: 'insensitive' } },
                        { email: { contains: searchString, mode: 'insensitive' } },
                    ],
                }
                : {};
            const [branch, count] = await Promise.all([
                prisma.branch.findMany({
                    where,
                    skip,
                    take: Number(size),
                    include: {
                        address: {
                            include: {
                                district: true,
                                state: true,
                                country: true,
                            },
                        },
                        contacts: true,
                        manufacturer: true,
                        personInCharge: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.branch.count({ where }),
            ]);
            // Calculate active user counts for each branch using the helper
            const branchesWithCounts = await Promise.all(branch.map(async (b) => {
                const counts = await this.getCountsForBranch(b.id);
                return { ...b, ...counts };
            }));
            return { branch: branchesWithCounts, total: count };
        }
        catch (error) {
            console.error('[BranchService.getAllBranches] Error:', error);
            throw error;
        }
    }
    static async getCountsForBranch(branchId) {
        try {
            const activeCount = await prisma.user.count({
                where: {
                    status: true,
                    OR: [
                        { profile: { branch: { some: { id: branchId } } } },
                        { branchInChargeOf: { some: { id: branchId } } },
                    ],
                },
            });
            const inactiveCount = await prisma.user.count({
                where: {
                    status: { not: true },
                    OR: [
                        { profile: { branch: { some: { id: branchId } } } },
                        { branchInChargeOf: { some: { id: branchId } } },
                    ],
                },
            });
            return {
                count: activeCount,
                inactiveCount,
                totalCount: activeCount + inactiveCount,
            };
        }
        catch (error) {
            console.error(`[BranchService.getCountsForBranch] Error for branch ${branchId}:`, error);
            // Return 0s instead of throwing to prevent the whole list from failing
            return {
                count: 0,
                inactiveCount: 0,
                totalCount: 0,
            };
        }
    }
    static async getBranchById(id) {
        const branch = await prisma.branch.findUnique({
            where: { id },
            include: {
                address: {
                    include: {
                        district: true,
                        state: true,
                        country: true,
                    },
                },
                contacts: true,
                manufacturer: true,
                personInCharge: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        if (branch) {
            const counts = await this.getCountsForBranch(branch.id);
            return { ...branch, ...counts };
        }
        return null;
    }
    static async createBranch(data, userId) {
        const { name, gst, email, url, googleMapUrl, lat, lon, senderId, address, contacts, manufacturer, personInCharge, } = data;
        // Get the first company ID if not provided (autoinn logic)
        const company = await prisma.company.findFirst();
        if (!company)
            throw new Error('No company found. Please create a company first.');
        const newBranch = await prisma.branch.create({
            data: {
                name,
                gst,
                email,
                url,
                googleMapUrl,
                lat: lat ? parseFloat(lat) : null,
                lon: lon ? parseFloat(lon) : null,
                senderId,
                company: { connect: { id: company.id } },
                createdBy: userId ? { connect: { id: userId } } : undefined,
                address: address
                    ? {
                        create: {
                            line1: address.line1,
                            line2: address.line2,
                            line3: address.line3,
                            locality: address.locality,
                            pincode: address.pincode,
                            district: address.district ? { connect: { id: address.district } } : undefined,
                            state: address.state ? { connect: { id: address.state } } : undefined,
                            country: address.country ? { connect: { id: address.country } } : undefined,
                            createdBy: userId ? { connect: { id: userId } } : undefined,
                        },
                    }
                    : undefined,
                contacts: contacts && contacts.length > 0
                    ? {
                        create: contacts.map((c) => ({
                            phone: c.phone,
                            category: c.category || c.phone,
                        })),
                    }
                    : undefined,
                manufacturer: manufacturer && manufacturer.length > 0
                    ? {
                        connect: manufacturer.map((id) => ({ id })),
                    }
                    : undefined,
                personInCharge: personInCharge && personInCharge.length > 0
                    ? {
                        connect: personInCharge.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                address: true,
                contacts: true,
                manufacturer: true,
                personInCharge: true,
            },
        });
        const counts = await this.getCountsForBranch(newBranch.id);
        return { ...newBranch, ...counts };
    }
    static async updateBranch(id, data, userId) {
        const { name, gst, email, url, googleMapUrl, lat, lon, senderId, address, contacts, manufacturer, personInCharge, } = data;
        // First fetch current relations to handle disconnects (matching autoinn's disconnect-then-connect pattern)
        const currentBranch = await prisma.branch.findUnique({
            where: { id },
            include: { manufacturer: true, personInCharge: true },
        });
        if (!currentBranch)
            throw new Error('Branch not found');
        const updatedBranch = await prisma.branch.update({
            where: { id },
            data: {
                name,
                gst,
                email,
                url,
                googleMapUrl,
                lat: lat ? parseFloat(lat) : undefined,
                lon: lon ? parseFloat(lon) : undefined,
                senderId,
                address: address
                    ? {
                        upsert: {
                            update: {
                                line1: address.line1,
                                line2: address.line2,
                                line3: address.line3,
                                locality: address.locality,
                                pincode: address.pincode,
                                district: address.district ? { connect: { id: address.district } } : undefined,
                                state: address.state ? { connect: { id: address.state } } : undefined,
                                country: address.country ? { connect: { id: address.country } } : undefined,
                            },
                            create: {
                                line1: address.line1,
                                line2: address.line2,
                                line3: address.line3,
                                locality: address.locality,
                                pincode: address.pincode,
                                district: address.district ? { connect: { id: address.district } } : undefined,
                                state: address.state ? { connect: { id: address.state } } : undefined,
                                country: address.country ? { connect: { id: address.country } } : undefined,
                                createdBy: userId ? { connect: { id: userId } } : undefined,
                            }
                        }
                    }
                    : undefined,
                contacts: contacts
                    ? {
                        deleteMany: {},
                        create: contacts.map((c) => ({
                            phone: c.phone,
                            category: c.category || c.phone,
                        })),
                    }
                    : undefined,
                manufacturer: manufacturer
                    ? {
                        set: manufacturer.map((id) => ({ id })),
                    }
                    : undefined,
                personInCharge: personInCharge
                    ? {
                        set: personInCharge.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                address: true,
                contacts: true,
                manufacturer: true,
                personInCharge: true,
            },
        });
        const counts = await this.getCountsForBranch(updatedBranch.id);
        return { ...updatedBranch, ...counts };
    }
    static async deleteBranch(id) {
        const count = await prisma.branch.count();
        if (count <= 1) {
            return { code: 300, message: "There is only one branch present" };
        }
        await prisma.branch.delete({ where: { id } });
        return { code: 200, message: "Branch deleted successfully" };
    }
}
