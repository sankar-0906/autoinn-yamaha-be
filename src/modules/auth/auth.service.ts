import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';
const JWT_EXPIRES_IN = '1d';

export class AuthService {
    static async hashPassword(password: string) {
        return bcrypt.hash(password, 10);
    }

    static async comparePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

    static generateToken(payload: any) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static async login(phone: string, pass: string) {
        const user = await prisma.user.findFirst({
            where: { phone },
            include: { profile: true }
        });

        if (!user || !user.password) {
            throw new Error('User not found');
        }

        const isValid = await this.comparePassword(pass, user.password);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken({ id: user.id, phone: user.phone });

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return { user, token };
    }
}
