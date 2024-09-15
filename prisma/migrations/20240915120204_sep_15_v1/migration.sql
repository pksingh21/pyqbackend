/*
  Warnings:

  - You are about to drop the column `uuid` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `uid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "User_uuid_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uuid",
ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
