/*
  Warnings:

  - The primary key for the `Paper` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PaperQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `QuestionChoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Test` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TestQuestionStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Paper" DROP CONSTRAINT "Paper_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PaperQuestion" DROP CONSTRAINT "PaperQuestion_createdById_fkey";

-- DropForeignKey
ALTER TABLE "PaperQuestion" DROP CONSTRAINT "PaperQuestion_paperId_fkey";

-- DropForeignKey
ALTER TABLE "PaperQuestion" DROP CONSTRAINT "PaperQuestion_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_createdById_fkey";

-- DropForeignKey
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_createdById_fkey";

-- DropForeignKey
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_paperId_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestionStatus" DROP CONSTRAINT "TestQuestionStatus_createdById_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestionStatus" DROP CONSTRAINT "TestQuestionStatus_questionId_fkey";

-- DropForeignKey
ALTER TABLE "TestQuestionStatus" DROP CONSTRAINT "TestQuestionStatus_testId_fkey";

-- DropForeignKey
ALTER TABLE "_PaperTags" DROP CONSTRAINT "_PaperTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_PaperTags" DROP CONSTRAINT "_PaperTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionTags" DROP CONSTRAINT "_QuestionTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionTags" DROP CONSTRAINT "_QuestionTags_B_fkey";

-- DropForeignKey
ALTER TABLE "_TestQuestionStatusChoices" DROP CONSTRAINT "_TestQuestionStatusChoices_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestQuestionStatusChoices" DROP CONSTRAINT "_TestQuestionStatusChoices_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserInterestedTags" DROP CONSTRAINT "_UserInterestedTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserInterestedTags" DROP CONSTRAINT "_UserInterestedTags_B_fkey";

-- AlterTable
ALTER TABLE "Paper" DROP CONSTRAINT "Paper_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Paper_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Paper_id_seq";

-- AlterTable
ALTER TABLE "PaperQuestion" DROP CONSTRAINT "PaperQuestion_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "paperId" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PaperQuestion_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PaperQuestion_id_seq";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "QuestionChoice" DROP CONSTRAINT "QuestionChoice_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "QuestionChoice_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "QuestionChoice_id_seq";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tag_id_seq";

-- AlterTable
ALTER TABLE "Test" DROP CONSTRAINT "Test_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "paperId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Test_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Test_id_seq";

-- AlterTable
ALTER TABLE "TestQuestionStatus" DROP CONSTRAINT "TestQuestionStatus_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdById" SET DATA TYPE TEXT,
ALTER COLUMN "testId" SET DATA TYPE TEXT,
ALTER COLUMN "questionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "TestQuestionStatus_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TestQuestionStatus_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "_PaperTags" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_QuestionTags" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TestQuestionStatusChoices" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_UserInterestedTags" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionChoice" ADD CONSTRAINT "QuestionChoice_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionChoice" ADD CONSTRAINT "QuestionChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paper" ADD CONSTRAINT "Paper_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperQuestion" ADD CONSTRAINT "PaperQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestionStatus" ADD CONSTRAINT "TestQuestionStatus_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestionStatus" ADD CONSTRAINT "TestQuestionStatus_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestionStatus" ADD CONSTRAINT "TestQuestionStatus_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInterestedTags" ADD CONSTRAINT "_UserInterestedTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInterestedTags" ADD CONSTRAINT "_UserInterestedTags_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionTags" ADD CONSTRAINT "_QuestionTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionTags" ADD CONSTRAINT "_QuestionTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionStatusChoices" ADD CONSTRAINT "_TestQuestionStatusChoices_A_fkey" FOREIGN KEY ("A") REFERENCES "QuestionChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionStatusChoices" ADD CONSTRAINT "_TestQuestionStatusChoices_B_fkey" FOREIGN KEY ("B") REFERENCES "TestQuestionStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaperTags" ADD CONSTRAINT "_PaperTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaperTags" ADD CONSTRAINT "_PaperTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
