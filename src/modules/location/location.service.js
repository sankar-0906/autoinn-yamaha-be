import prisma from '../../utils/prisma.js';
export class LocationService {
    static async getCountries() {
        return prisma.country.findMany({
            orderBy: { name: 'asc' }
        });
    }
    static async getStates(countryId) {
        return prisma.state.findMany({
            where: { countryId },
            orderBy: { name: 'asc' }
        });
    }
    static async getCities(stateId) {
        return prisma.city.findMany({
            where: { stateId },
            orderBy: { name: 'asc' }
        });
    }
}
//# sourceMappingURL=location.service.js.map