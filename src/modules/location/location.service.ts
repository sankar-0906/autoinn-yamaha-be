import prisma from '../../utils/prisma.js';

export class LocationService {
    static async getCountries() {
        return prisma.country.findMany({
            orderBy: { name: 'asc' }
        });
    }

    static async getStates(countryId: string) {
        return prisma.state.findMany({
            where: { countryId },
            orderBy: { name: 'asc' }
        });
    }

    static async getCities(stateId: string) {
        return prisma.city.findMany({
            where: { stateId },
            orderBy: { name: 'asc' }
        });
    }
}
