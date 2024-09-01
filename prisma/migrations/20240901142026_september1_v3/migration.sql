/*
  Warnings:

  - You are about to drop the `_QuestionChoiceToTestQuestionStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_QuestionChoiceToTestQuestionStatus" DROP CONSTRAINT "_QuestionChoiceToTestQuestionStatus_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionChoiceToTestQuestionStatus" DROP CONSTRAINT "_QuestionChoiceToTestQuestionStatus_B_fkey";

-- DropTable
DROP TABLE "_QuestionChoiceToTestQuestionStatus";

-- CreateTable
CREATE TABLE "_TestQuestionStatusChoices" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TestQuestionStatusChoices_AB_unique" ON "_TestQuestionStatusChoices"("A", "B");

-- CreateIndex
CREATE INDEX "_TestQuestionStatusChoices_B_index" ON "_TestQuestionStatusChoices"("B");

-- AddForeignKey
ALTER TABLE "_TestQuestionStatusChoices" ADD CONSTRAINT "_TestQuestionStatusChoices_A_fkey" FOREIGN KEY ("A") REFERENCES "QuestionChoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestQuestionStatusChoices" ADD CONSTRAINT "_TestQuestionStatusChoices_B_fkey" FOREIGN KEY ("B") REFERENCES "TestQuestionStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
