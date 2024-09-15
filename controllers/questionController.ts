import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Question, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import { CreateQuestionsDTO } from '../dtos/question';

const prisma = new PrismaClient();

// this method just creates a basic question doesn't create shit like which begins with [] sign in the db document
const createQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { content }: { content: Question } = req.body;
  const user = (req as any).user as User;
  const newQuestion = await prisma.question.create({
    data: {
      text: content.text,
      images: content.images,
      isMultiCorrect: content.isMultiCorrect,
      createdBy: {
        connect: {
          uid: user.uid,
        },
      },
    },
  });

  res.status(201).json({ message: 'Question created', question: newQuestion });
});

const createQuestions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { questions }: { questions: CreateQuestionsDTO } = req.body;
  const user = (req as any).user as User;

  // Bulk create questions
  const newQuestions = await prisma.question.createManyAndReturn({
    data: questions.map((question) => ({
      text: question.text,
      isMultiCorrect: question.isMultiCorrect,
      createdById: user.id,
    })),
  });

  const choices = questions.flatMap((question, index) =>
    question.choices.map((choice, choiceIndex) => ({
      text: choice.text,
      isAnswer: choice.isAnswer,
      choiceOrder: choiceIndex,
      questionId: newQuestions[index].id,
      createdById: user.id,
    }))
  );

  // Bulk create choices referencing the associated question
  const newChoices = await prisma.questionChoice.createManyAndReturn({
    data: choices,
  });

  const data = newQuestions.map((question) => ({
    ...question,
    choices: newChoices.filter((choice) => choice.questionId === question.id),
  }));

  res.status(201).json({ message: 'Questions created successfully!', data });
});

const getQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const question = await prisma.question.findUnique({
    where: { id },
  });

  if (!question) return next(new AppError('Question not found', 404));

  res.status(200).json({ question });
});

const updateQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { content }: { content: Question } = req.body;

  const updatedQuestion = await prisma.question.update({
    where: { id },
    data: {
      text: content.text,
      images: content.images,
      isMultiCorrect: content.isMultiCorrect,
    },
  });

  res.status(200).json({ message: 'Question updated', question: updatedQuestion });
});

const updateQuestionChoiceForQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; // id of the question
  const { choiceIds }: { choiceIds?: string[] } = req.body;

  // Fetch the existing Question to ensure it exists
  const existingQuestion = await prisma.question.findUnique({
    where: { id },
    include: { choices: true }, // Include existing choices
  });

  if (!existingQuestion) {
    return next(new AppError('Question not found', 404));
  }

  // Perform the update
  const updatedQuestion = await prisma.question.update({
    where: { id },
    data: {
      choices: {
        set: choiceIds ? choiceIds.map((choiceId) => ({ id: choiceId })) : [], // 'set' will replace existing choices with new ones
      },
    },
  });

  res.status(200).json({ message: 'Question choices updated', question: updatedQuestion });
});

const deleteQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.question.delete({
    where: { id },
  });

  res.status(204).send();
});

export { createQuestions, getQuestion, updateQuestion, deleteQuestion, updateQuestionChoiceForQuestion };
