import prisma from '../../utils/prisma.js';
export class VehicleMasterService {
    static async getAll() {
        return prisma.vehicleMaster.findMany({
            include: { manufacturer: true, images: true, prices: true }
        });
    }
    static async getById(id) {
        return prisma.vehicleMaster.findUnique({
            where: { id },
            include: { manufacturer: true, images: true, prices: true }
        });
    }
    static async create(data) {
        const { images, ...rest } = data;
        return prisma.vehicleMaster.create({
            data: {
                ...rest,
                images: images ? {
                    create: images.map((img) => ({
                        color: img.color,
                        code: img.code,
                        url: img.url,
                        createdById: rest.createdById
                    }))
                } : undefined
            },
            include: { manufacturer: true, images: true, prices: true }
        });
    }
    static async update(id, data) {
        const { images, ...rest } = data;
        // Update the main record first
        const updated = await prisma.vehicleMaster.update({
            where: { id },
            data: rest,
            include: { images: true }
        });
        if (images) {
            // Simple sync: delete existing images and recreate
            // In a production app, we might want to preserve IDs for unchanged images
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
                            createdById: rest.createdById
                        }))
                    }
                }
            });
        }
        return prisma.vehicleMaster.findUnique({
            where: { id },
            include: { manufacturer: true, images: true, prices: true }
        });
    }
    static async delete(id) {
        return prisma.vehicleMaster.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=vehicleMaster.service.js.map