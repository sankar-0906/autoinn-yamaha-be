import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import logger from './utils/logger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';
const app = express();
// Middlewares
app.use(cors({
    origin: [ENV.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// HTTP request logger
app.use((req, res, next) => {
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
