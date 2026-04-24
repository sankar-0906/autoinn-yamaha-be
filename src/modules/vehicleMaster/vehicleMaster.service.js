import prisma from '../../utils/prisma.js';
export class VehicleMasterService {
    static async getAll() {
        const vehicles = await prisma.vehicleMaster.findMany({
            include: {
                manufacturer: true,
                images: true,
                prices: {
                    include: { colors: true }
                },
                files: true,
                hsn: true,
                services: true
            }
        });
        return vehicles.map(v => this.transformResponse(v));
    }
    static transformResponse(vehicle) {
        if (!vehicle)
            return null;
        return {
            ...vehicle,
            image: vehicle.images || [],
            price: (vehicle.prices || []).map((p) => ({
                ...p,
                colors: p.colors || []
            })),
            file: vehicle.files || [],
            services: vehicle.services || []
        };
    }
    static async getById(id) {
        const vehicle = await prisma.vehicleMaster.findUnique({
            where: { id },
            include: {
                manufacturer: true,
                images: true,
                prices: {
                    include: { colors: true }
                },
                files: true,
                hsn: true,
                services: true
            }
        });
        return this.transformResponse(vehicle);
    }
    static async create(data) {
        const { images, files, manufacturerId, createdById, ...rest } = data;
        const vehicle = await prisma.vehicleMaster.create({
            data: {
                ...rest,
                manufacturer: manufacturerId ? { connect: { id: manufacturerId } } : undefined,
                createdBy: createdById ? { connect: { id: createdById } } : undefined,
                images: images ? {
                    create: images.map((img) => ({
                        color: img.color,
                        code: img.code,
                        url: img.url,
                        createdById: createdById
                    }))
                } : undefined,
                files: files ? {
                    create: files.map((file) => ({
                        name: file.name,
                        url: file.url,
                        fileType: file.fileType,
                        createdById: createdById
                    }))
                } : undefined
            },
            include: { manufacturer: true, images: true, prices: true, files: true }
        });
        return this.transformResponse(vehicle);
    }
    static async update(id, data) {
        const { images, files, manufacturerId, createdById, ...rest } = data;
        // Update the main record first
        await prisma.vehicleMaster.update({
            where: { id },
            data: {
                ...rest,
                manufacturer: manufacturerId ? { connect: { id: manufacturerId } } : undefined,
                createdBy: createdById ? { connect: { id: createdById } } : undefined,
            }
        });
        if (images) {
            await prisma.image.deleteMany({
                where: { vehicleMasterId: id }
            });
            await prisma.vehicleMaster.update({
                where: { id },
                data: {
                    images: {
                        create: images.map((img) => ({
                            color: img.color,
                            code: img.code,
                            url: img.url,
                            createdById: createdById
                        }))
                    }
                }
            });
        }
        if (files) {
            await prisma.file.deleteMany({
                where: { vehicleMasterId: id }
            });
            await prisma.vehicleMaster.update({
                where: { id },
                data: {
                    files: {
                        create: files.map((file) => ({
                            name: file.name,
                            url: file.url,
                            fileType: file.fileType,
                            createdById: createdById
                        }))
                    }
                }
            });
        }
        const vehicle = await prisma.vehicleMaster.findUnique({
            where: { id },
            include: {
                manufacturer: true,
                images: true,
                prices: {
                    include: { colors: true }
                },
                files: true,
                hsn: true,
                services: true
            }
        });
        return this.transformResponse(vehicle);
    }
    static async delete(id) {
        return prisma.vehicleMaster.delete({
            where: { id }
        });
    }
    static async getUniqueModelCodes() {
        const models = await prisma.vehicleMaster.findMany({
            select: { modelCode: true },
            distinct: ['modelCode'],
            where: { modelCode: { not: null } }
        });
        return models.map(m => m.modelCode).sort();
    }
    static async getColorsByModelCode(modelCode) {
        const vehicle = await prisma.vehicleMaster.findFirst({
            where: { modelCode },
            include: { images: true }
        });
        if (!vehicle || !vehicle.images)
            return [];
        // Return unique color codes/names from the Images mapping
        const colors = vehicle.images.map(img => ({
            code: img.code,
            color: img.color
        }));
        // Deduplicate by code
        return Array.from(new Map(colors.map(item => [item['code'], item])).values());
    }
}
//# sourceMappingURL=vehicleMaster.service.js.map