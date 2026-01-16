-- AlterTable
ALTER TABLE "coffee_entries" ADD COLUMN     "customTypeId" TEXT,
ALTER COLUMN "type" DROP NOT NULL;

-- CreateTable
CREATE TABLE "custom_coffee_types" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "caffeine" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_coffee_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntryCompanions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "custom_coffee_types_userId_idx" ON "custom_coffee_types"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_coffee_types_userId_name_key" ON "custom_coffee_types"("userId", "name");

-- CreateIndex
CREATE INDEX "companions_userId_idx" ON "companions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "companions_userId_name_key" ON "companions"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "_EntryCompanions_AB_unique" ON "_EntryCompanions"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryCompanions_B_index" ON "_EntryCompanions"("B");

-- AddForeignKey
ALTER TABLE "custom_coffee_types" ADD CONSTRAINT "custom_coffee_types_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companions" ADD CONSTRAINT "companions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coffee_entries" ADD CONSTRAINT "coffee_entries_customTypeId_fkey" FOREIGN KEY ("customTypeId") REFERENCES "custom_coffee_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntryCompanions" ADD CONSTRAINT "_EntryCompanions_A_fkey" FOREIGN KEY ("A") REFERENCES "coffee_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntryCompanions" ADD CONSTRAINT "_EntryCompanions_B_fkey" FOREIGN KEY ("B") REFERENCES "companions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
