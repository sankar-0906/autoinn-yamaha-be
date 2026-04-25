import app from './app.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

dotenv.config();

if (!process.env.VERCEL) {
    import('./modules/vehicleStockInward/vehicleStockInward.worker.js');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
}

export default app;

