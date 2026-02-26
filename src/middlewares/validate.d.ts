import type { Request, Response, NextFunction } from 'express';
import type { ObjectSchema } from 'joi';
export declare const validate: (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map