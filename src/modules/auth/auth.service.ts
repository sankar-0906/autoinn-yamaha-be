import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../utils/prisma.js';
import { ENV } from '../../../config/env.js';

const JWT_SECRET = ENV.JWT_SECRET;

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
        const users = await prisma.user.findMany({
            where: {
                phone,
                status: true
            },
            include: { profile: true }
        });

        if (users.length === 0) {
            console.log('Login Error: No active user found with this phone');
            throw new Error('User not found');
        }

        let authenticatedUser = null;
        for (const user of users) {
            if (!user.password) continue;
            const isValid = await this.comparePassword(pass, user.password);
            if (isValid) {
                authenticatedUser = user;
                break;
            }
        }


        if (!authenticatedUser) {
            console.log('Login Error: Password mismatch for all matching phone records');
            throw new Error('Invalid credentials');
        }


        const user = authenticatedUser;
        const token = this.generateToken({ id: user.id, phone: user.phone });

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return { user, token };
    }
}
