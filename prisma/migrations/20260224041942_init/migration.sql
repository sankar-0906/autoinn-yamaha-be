-- CreateTable
CREATE TABLE "IdCreation" (
    "id" TEXT NOT NULL,
    "subModule" TEXT,
    "text" TEXT,
    "startCount" TEXT,
    "count" TEXT,
    "scope" TEXT,
    "resetAnnually" BOOLEAN,
    "branchId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdCreation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IdCreation" ADD CONSTRAINT "IdCreation_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdCreation" ADD CONSTRAINT "IdCreation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
