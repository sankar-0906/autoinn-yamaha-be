import prisma from '../../utils/prisma.js';

export class ManufacturerService {
    static async getAll() {
        return prisma.manufacturer.findMany({
            include: { address: true }
        });
    }

    static async getById(id: string) {
        return prisma.manufacturer.findUnique({
            where: { id },
            include: { address: true }
        });
    }

    static async create(data: any) {
  const { line1, line2, line3, locality, cityId, stateId, countryId, pincode, ...rest } = data;

  return prisma.manufacturer.create({
    data: {
      ...rest,
      address: {
        create: {
          line1,
          line2,
          line3,
          locality,
          // only connect if IDs are defined
          ...(cityId ? { district: { connect: { id: cityId } } } : {}),
          ...(stateId ? { state: { connect: { id: stateId } } } : {}),
          ...(countryId ? { country: { connect: { id: countryId } } } : {}),
          pincode,
        },
      },
    },
    include: {
      address: {
        include: {
          district: true,
          state: true,
          country: true,
        },
      },
    },
  });
}

    static async update(id: string, data: any) {
        const { line1, line2, line3, locality, cityId, stateId, countryId, pincode, ...rest } = data;
        return prisma.manufacturer.update({
            where: { id },
            data: {
                ...rest,
                address: {
                    update: {
                        line1,
                        line2,
                        line3,
                        locality,
                        district: cityId ? { connect: { id: cityId } } : undefined,
                        state: stateId ? { connect: { id: stateId } } : undefined,
                        country: countryId ? { connect: { id: countryId } } : undefined,
                        pincode
                    }
                }
            },
            include: { address: { include: { district: true, state: true, country: true } } }
        });
    }

    static async delete(id: string) {
        return prisma.manufacturer.delete({
            where: { id }
        });
    }
}
