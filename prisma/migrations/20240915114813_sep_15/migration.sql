/*
  Warnings:

  - You are about to drop the column `correctMarks` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `incorrectMarks` on the `Question` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "PaperQuestion" ADD COLUMN     "correctMarks" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrectMarks" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "correctMarks",
DROP COLUMN "incorrectMarks";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "uuid" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
