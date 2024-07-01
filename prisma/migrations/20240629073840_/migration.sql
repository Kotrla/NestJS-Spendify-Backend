/*
  Warnings:

  - You are about to drop the column `amount` on the `Investment` table. All the data in the column will be lost.
  - Added the required column `boughtValue` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentValue` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Investment" DROP COLUMN "amount",
ADD COLUMN     "boughtValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currentValue" DOUBLE PRECISION NOT NULL;
