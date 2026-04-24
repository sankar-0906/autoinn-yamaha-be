import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const vms = await prisma.vehicleMaster.findMany({ take: 5 });
    console.log('VehicleMasters:', JSON.stringify(vms, null, 2));
    const imgs = await prisma.image.findMany({ take: 5 });
    console.log('Images:', JSON.stringify(imgs, null, 2));
    process.exit(0);
}
main();
//# sourceMappingURL=debug_db.js.map