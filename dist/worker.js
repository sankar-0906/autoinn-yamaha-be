import logger from './utils/logger.js';
// import your workers
import './modules/vehicleStockInward/vehicleStockInward.worker.js';
logger.info("👷 Worker started...");
