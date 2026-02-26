export declare class LocationService {
    static getCountries(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        sortName: string;
        phoneCode: string | null;
    }[]>;
    static getStates(countryId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        countryId: string;
    }[]>;
    static getCities(stateId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        stateId: string;
    }[]>;
}
//# sourceMappingURL=location.service.d.ts.map