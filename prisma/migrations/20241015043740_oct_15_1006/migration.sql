-- DropForeignKey
ALTER TABLE "PaperQuestion" DROP CONSTRAINT "PaperQuestion_questionId_fkey";

-- AlterTable
ALTER TABLE "PaperQuestion" ALTER COLUMN "questionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
