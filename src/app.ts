import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import { ENV } from './config/env.js';

import { sendError } from './utils/response.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://autoinn-yamaha-fe.vercel.app'
    ],
    credentials: true
}));
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// HTTP request logger
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    // Log incoming request + body in debug mode
    logger.debug(`→ ${req.method} ${req.path}`, req.body && Object.keys(req.body).length ? { body: req.body } : undefined);
    res.on('finish', () => {
        logger.http(req.method, req.path, res.statusCode, Date.now() - start);
        // Log errors with body for easier debugging
        if (res.statusCode >= 400) {
            logger.warn(`Request failed ${res.statusCode}`, {
                method: req.method,
                path: req.path,
                body: req.body,
                query: req.query,
            });
        }
    });
    next();
});

// Routes
app.use('/api', routes);

// Error Handling
app.use(errorHandler);

export default app;
