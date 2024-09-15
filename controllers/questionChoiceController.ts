import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Question, QuestionChoice, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

const createQuestionChoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { content }: { content: QuestionChoice } = req.body;
  const user = (req as any).user as User;
  const question = await prisma.question.findUnique({
    where: {
      id: content.questionId,
    },
  });
  if (question && user) {
    const newQuestionChoice = await prisma.questionChoice.create({
      data: {
        text: content.text,
        isAnswer: content.isAnswer,
        choiceOrder: content.choiceOrder,
        question: {
          connect: {
            id: question.id,
          },
        },
        createdBy: {
          connect: {
            id: user.id, // Connect using the user's id
          },
        },
      },
    });
    res.status(201).json({
      message: 'Question choice created',
      questionChoice: newQuestionChoice,
    });
  } else {
    return next(new AppError('Question Id given is wrong or user id might be wrong', 403));
  }
});

const getQuestionChoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const questionChoice = await prisma.questionChoice.findUnique({
    where: { id },
  });

  if (!questionChoice) return next(new AppError('Question choice not found', 404));

  res.status(200).json({ questionChoice });
});

const updateQuestionChoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { content }: { content: Partial<QuestionChoice> } = req.body;

  // Find the QuestionChoice to ensure it exists
  const questionChoice = await prisma.questionChoice.findUnique({
    where: { id },
  });

  if (!questionChoice) {
    return next(new AppError('QuestionChoice with the given ID does not exist', 404));
  }

  // Prepare data object with conditional question update
  const updateData: any = {
    text: content.text ?? questionChoice.text,
    isAnswer: content.isAnswer ?? questionChoice.isAnswer,
    choiceOrder: content.choiceOrder ?? questionChoice.choiceOrder,
  };

  if (content.questionId !== undefined) {
    const question = await prisma.question.findUnique({
      where: { id: content.questionId },
    });

    if (question) {
      updateData.question = {
        connect: {
          id: content.questionId,
        },
      };
    } else {
      return next(new AppError('Question Id given is wrong', 403));
    }
  }

  // Perform the update
  const updatedQuestionChoice = await prisma.questionChoice.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({
    message: 'Question choice updated successfully',
    questionChoice: updatedQuestionChoice,
  });
});

const deleteQuestionChoice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.questionChoice.delete({
    where: { id },
  });

  res.status(204).send();
});

export { createQuestionChoice, getQuestionChoice, updateQuestionChoice, deleteQuestionChoice };
