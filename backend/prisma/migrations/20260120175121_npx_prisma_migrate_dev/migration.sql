/*
  Warnings:

  - Changed the type of `actor` on the `booking_events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BookingActor" AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN', 'SYSTEM');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SYSTEM';

-- AlterTable
ALTER TABLE "booking_events" DROP COLUMN "actor",
ADD COLUMN     "actor" "BookingActor" NOT NULL;
