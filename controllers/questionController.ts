import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Question, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import deepEqual from '../utils/deepEqual';

import { QuestionDTO } from '../dtos';

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
  const { questions }: { questions: QuestionDTO[] } = req.body;
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
    question.choices.map((choice) => ({
      text: choice.text,
      isAnswer: choice.isAnswer,
      choiceOrder: choice.choiceOrder,
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
  const { includeChoices } = req.query;

  const shouldIncludeChoices = includeChoices === 'true';

  const question = await prisma.question.findUnique({
    where: { id },
    include: shouldIncludeChoices ? { choices: true } : {},
  });

  if (!question) return next(new AppError('Question not found', 404));
  res.status(200).json({ message: 'Question fetched successfully!!', data: question });
});

const getQuestions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit, includeChoices } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const shouldIncludeChoices = includeChoices === 'true';

  const questions = await prisma.question.findMany({
    skip,
    take: limitNumber,
    include: shouldIncludeChoices ? { choices: true } : {},
  });

  if (!questions.length) {
    return next(new AppError('No questions found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Questions fetched successfully',
    data: {
      questions,
      page,
      limit,
    },
  });
});

const getQuestionsCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const questionsCount = await prisma.question.count();

  res.status(200).json({ count: questionsCount });
});

const updateQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { question }: { question: QuestionDTO } = req.body;

  console.dir({ question }, { depth: null, colors: true });

  const originalQuestion = await prisma.question.findUnique({
    where: { id },
    include: { choices: true },
  });

  if (!originalQuestion) {
    return new AppError('Question does not exist!', 404);
  }

  // Compare and update 'question.text'
  if (originalQuestion.text !== question.text) {
    await prisma.question.update({
      where: { id },
      data: {
        text: question.text,
      },
    });
  }

  // Compare and update choices
  const existingChoices = originalQuestion.choices;
  const newChoices = question.choices;

  // Update existing choices
  const choicesToBeUpdated = [];
  const choicesToBeCreated = [];
  const choicesToBeDeleted = [];

  for (const choice of newChoices) {
    const existingChoice = existingChoices.find((c) => c.id === choice.id);
    if (existingChoice) {
      if (!deepEqual(existingChoice, choice)) {
        choicesToBeUpdated.push(choice);
      }
    } else {
      choicesToBeCreated.push(choice);
    }
  }

  for (const existingChoice of existingChoices) {
    if (!newChoices.find((choice) => choice.id === existingChoice.id)) {
      choicesToBeDeleted.push(existingChoice);
    }
  }

  const user = (req as any).user as User;

  // Bulk create choices referencing the associated question
  await prisma.questionChoice.createMany({
    data: choicesToBeCreated.map((choice) => ({
      text: choice.text,
      choiceOrder: choice.choiceOrder,
      isAnswer: choice.isAnswer,
      questionId: id,
      createdById: user.id,
    })),
  });

  // Bulk update choices referencing the associated question
  await Promise.all(
    choicesToBeUpdated.map((choice) =>
      prisma.questionChoice.update({
        where: { id: choice.id }, // Ensure you provide a unique identifier for each update
        data: {
          text: choice.text,
          choiceOrder: choice.choiceOrder,
          isAnswer: choice.isAnswer,
        },
      })
    )
  );

  // Bulk delete choices referencing the associated question
  await prisma.questionChoice.deleteMany({
    where: {
      id: { in: choicesToBeDeleted.map((choice) => choice.id) },
    },
  });

  const updatedQuestion = await prisma.question.findUnique({
    where: { id },
    include: {
      choices: {
        orderBy: {
          choiceOrder: 'asc',
        },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      question: updatedQuestion,
    },
  });
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

const deleteQuestionWithChoices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.$transaction(async (prisma) => {
    // Delete related choices first
    await prisma.questionChoice.deleteMany({
      where: {
        questionId: id,
      },
    });
    // Delete the question after the related choices are deleted
    await prisma.question.delete({
      where: { id },
    });
  });

  res.status(204).send();
});

export default {
  createQuestions,
  getQuestion,
  getQuestions,
  getQuestionsCount,
  updateQuestion,
  deleteQuestion,
  updateQuestionChoiceForQuestion,
  deleteQuestionWithChoices,
};
