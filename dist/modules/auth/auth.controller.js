import { AuthService } from './auth.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import prisma from '../../utils/prisma.js';
export class AuthController {
    static async login(req, res, next) {
        try {
            const { phone, password } = req.body;
            console.log(phone, password, "login cred");
            const result = await AuthService.login(phone, password);
            return sendSuccess(res, 'Login successful', result);
        }
        catch (error) {
            return sendError(res, error.message, 401);
        }
    }
    static async getCredentials(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId)
                return sendError(res, 'Unauthorized', 401);
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    profile: {
                        include: {
                            department: {
                                include: {
                                    roleAccess: {
                                        include: { access: true },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!user)
                return sendError(res, 'User not found', 404);
            // Strip password before sending
            const { password: _pwd, ...safeUser } = user;
            return sendSuccess(res, 'Credentials fetched', safeUser);
        }
        catch (error) {
            return sendError(res, error.message);
        }
    }
}
