/*
  Warnings:

  - You are about to drop the `_BanchHasManufacturers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BanchHasManufacturers" DROP CONSTRAINT "_BanchHasManufacturers_A_fkey";

-- DropForeignKey
ALTER TABLE "_BanchHasManufacturers" DROP CONSTRAINT "_BanchHasManufacturers_B_fkey";

-- AlterTable
ALTER TABLE "IdCreation" ADD COLUMN     "module" TEXT;

-- DropTable
DROP TABLE "_BanchHasManufacturers";

-- CreateTable
CREATE TABLE "FrameNumber" (
    "id" TEXT NOT NULL,
    "manufacturerId" TEXT,
    "position" INTEGER,
    "inputValue" TEXT,
    "inferredField" TEXT,
    "targetValue" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrameNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VehicleMasterHasImage" (
    "A" TEXT,
    "B" TEXT
);

-- CreateTable
CREATE TABLE "VehicleStockInward" (
    "id" TEXT NOT NULL,
    "inwardNo" TEXT,
    "manufacturerId" TEXT,
    "modeOfTransport" TEXT,
    "dealerName" TEXT,
    "address" TEXT,
    "deliveryAddress" TEXT,
    "invoiceNo" TEXT,
    "date" TIMESTAMP(3),
    "placeOfSupply" TEXT,
    "daNumber" TEXT,
    "daDate" TIMESTAMP(3),
    "transporter" TEXT,
    "policyNumber" TEXT,
    "vehicleNo" TEXT,
    "from" TEXT,
    "to" TEXT,
    "insuranceCo" TEXT,
    "createdById" TEXT,
    "branchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleStockInward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleStockItem" (
    "id" TEXT NOT NULL,
    "inwardId" TEXT NOT NULL,
    "vehicleMasterId" TEXT,
    "imageId" TEXT,
    "engineNo" TEXT,
    "chassisNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleStockItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BranchHasManufacturers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BranchHasManufacturers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleStockInward_inwardNo_key" ON "VehicleStockInward"("inwardNo");

-- CreateIndex
CREATE INDEX "_BranchHasManufacturers_B_index" ON "_BranchHasManufacturers"("B");

-- AddForeignKey
ALTER TABLE "FrameNumber" ADD CONSTRAINT "FrameNumber_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameNumber" ADD CONSTRAINT "FrameNumber_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockInward" ADD CONSTRAINT "VehicleStockInward_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockInward" ADD CONSTRAINT "VehicleStockInward_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockInward" ADD CONSTRAINT "VehicleStockInward_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockItem" ADD CONSTRAINT "VehicleStockItem_inwardId_fkey" FOREIGN KEY ("inwardId") REFERENCES "VehicleStockInward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockItem" ADD CONSTRAINT "VehicleStockItem_vehicleMasterId_fkey" FOREIGN KEY ("vehicleMasterId") REFERENCES "VehicleMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleStockItem" ADD CONSTRAINT "VehicleStockItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchHasManufacturers" ADD CONSTRAINT "_BranchHasManufacturers_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchHasManufacturers" ADD CONSTRAINT "_BranchHasManufacturers_B_fkey" FOREIGN KEY ("B") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
