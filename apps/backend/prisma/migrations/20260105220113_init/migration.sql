-- CreateEnum
CREATE TYPE "CoffeeType" AS ENUM ('ESPRESSO', 'AMERICANO', 'LATTE', 'CAPPUCCINO', 'FLAT_WHITE', 'MACCHIATO', 'MOCHA', 'COLD_BREW', 'ICED_COFFEE', 'DRIP_COFFEE', 'POUR_OVER', 'FRENCH_PRESS', 'OTHER');

-- CreateEnum
CREATE TYPE "CoffeeSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coffee_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "CoffeeType" NOT NULL,
    "size" "CoffeeSize" NOT NULL,
    "caffeine" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "consumedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coffee_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "coffee_entries_userId_consumedAt_idx" ON "coffee_entries"("userId", "consumedAt");

-- CreateIndex
CREATE INDEX "coffee_entries_userId_idx" ON "coffee_entries"("userId");

-- AddForeignKey
ALTER TABLE "coffee_entries" ADD CONSTRAINT "coffee_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
