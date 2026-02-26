/*
  Warnings:

  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SupplierHasShippingAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Supplier" DROP CONSTRAINT "Supplier_createdById_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierHasShippingAddress" DROP CONSTRAINT "_SupplierHasShippingAddress_A_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierHasShippingAddress" DROP CONSTRAINT "_SupplierHasShippingAddress_B_fkey";

-- DropTable
DROP TABLE "Supplier";

-- DropTable
DROP TABLE "_SupplierHasShippingAddress";

-- CreateTable
CREATE TABLE "Dealer" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "dealerType" TEXT,
    "GSTIN" TEXT,
    "status" TEXT,
    "email" TEXT,
    "remarks" TEXT,
    "addressId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dealer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DealerHasShippingAddress" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DealerHasShippingAddress_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DealerHasShippingAddress_B_index" ON "_DealerHasShippingAddress"("B");

-- AddForeignKey
ALTER TABLE "Dealer" ADD CONSTRAINT "Dealer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dealer" ADD CONSTRAINT "Dealer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DealerHasShippingAddress" ADD CONSTRAINT "_DealerHasShippingAddress_A_fkey" FOREIGN KEY ("A") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DealerHasShippingAddress" ADD CONSTRAINT "_DealerHasShippingAddress_B_fkey" FOREIGN KEY ("B") REFERENCES "Dealer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
