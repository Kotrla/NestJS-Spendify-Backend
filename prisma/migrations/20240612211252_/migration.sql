/*
  Warnings:

  - Changed the type of `type` on the `Spending` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `SpendingCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/

-- Delete all existing Spending and SpendingCategory records
DELETE FROM "Spending";
DELETE FROM "SpendingCategory";
-- CreateEnum
CREATE TYPE "SpendingType" AS ENUM ('EXPENSE', 'INCOME');

-- AlterTable
ALTER TABLE "Spending" DROP COLUMN "type",
ADD COLUMN     "type" "SpendingType" NOT NULL;

-- AlterTable
ALTER TABLE "SpendingCategory" DROP COLUMN "type",
ADD COLUMN     "type" "SpendingType" NOT NULL;
