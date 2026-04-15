export declare class AuthService {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static generateToken(payload: any): string;
    static login(phone: string, pass: string): Promise<{
        user: {
            profile: {
                id: string;
                createdById: string | null;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                addressId: string | null;
                bankDetailsId: string | null;
                bloodGroup: string | null;
                dateOfBirth: Date | null;
                dateOfJoining: Date | null;
                departmentId: string | null;
                employeeId: string | null;
                employeeName: string | null;
                fatherName: string | null;
                aadhaarNumber: string | null;
                drivingLicense: string | null;
                panNumber: string | null;
            } | null;
        } & {
            id: string;
            phone2: string | null;
            email: string | null;
            phone: string | null;
            password: string | null;
            profilePicture: string | null;
            status: boolean | null;
            employee: boolean | null;
            verified: boolean | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLoginAt: Date | null;
        };
        token: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map