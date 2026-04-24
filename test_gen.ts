import { IdGeneratorService } from './src/modules/idGenerator/idGenerator.service.js';
import prisma from './src/utils/prisma.js';

async function main() {
    console.log('Testing ID Generation for EMPLOYEE...');
    const employeeId = await IdGeneratorService.generateNextId('EMPLOYEE');
    console.log('Result for Employee:', employeeId);

    const vpiId = await IdGeneratorService.generateNextId('VPI');
    console.log('Result for Vehicle Purchase Invoice:', vpiId);
}

main().catch(console.error).finally(() => prisma.$disconnect());
