/*
  Warnings:

  - Added the required column `addressLabel` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddressLabel" AS ENUM ('HOME', 'OTHER');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "addressLabel" "AddressLabel" NOT NULL,
ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
