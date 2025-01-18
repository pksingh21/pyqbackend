import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Paper, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { ChoiceDTO, CreatePaperDTO, QuestionDTO } from '../dtos';

const prisma = new PrismaClient();

const createPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { paper }: { paper: CreatePaperDTO } = req.body;
  const user = (req as any).user as User;

  console.log({ paper });

  const newPaper = await prisma.paper.create({
    data: {
      title: paper.title,
      isModule: paper.isModule,
      duration: paper.duration ?? 120,
      createdBy: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  const questionData = Array.from({ length: paper.questionCount }).map((_, index) => ({
    questionOrder: index + 1,
    paperId: newPaper.id, // associate with the newly created paper
    createdById: user.id,
    correctMarks: 0,
    incorrectMarks: 0,
  }));

  await prisma.paperQuestion.createMany({
    data: questionData,
  });

  // console.log({ newPaper });

  res.status(201).json({ message: 'Paper created', paper: newPaper });
});

const getPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: {
          questionOrder: 'asc',
        },
        include: {
          // Populate the actual Question inside each PaperQuestion
          question: {
            include: {
              choices: {
                orderBy: {
                  choiceOrder: 'asc',
                },
              },
            },
          },
        },
      },
    },
  });

  if (!paper) return next(new AppError('Paper not found', 404));

  console.dir({ paper }, { depth: null, color: true });

  res.status(200).json({ paper });
});

const getPapers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const papers = await prisma.paper.findMany({
    skip,
    take: limitNumber,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });

  if (!papers.length) {
    return next(new AppError('No papers found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Papers fetched successfully',
    data: {
      papers,
      page,
      limit,
    },
  });
});

const getPaperCount = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const paperCount = await prisma.paper.count();

  res.status(200).json({ count: paperCount });
});

const updatePaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { paper }: { paper: Partial<Paper> } = req.body;

  // Find the Paper to ensure it exists
  const existingPaper = await prisma.paper.findUnique({
    where: { id },
  });

  if (!existingPaper) {
    return next(new AppError('Paper with the given ID does not exist', 404));
  }

  // Prepare data object with conditional updates
  const updateData: any = {};

  if (paper.title !== undefined) {
    updateData.title = paper.title;
  }
  if (paper.isModule !== undefined) {
    updateData.isModule = paper.isModule;
  }
  if (paper.duration !== undefined) {
    updateData.duration = paper.duration;
  }

  // Perform the update
  const updatedPaper = await prisma.paper.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({ message: 'Paper updated', paper: updatedPaper });
});

const updateTagsForPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { tagIds }: { tagIds?: string[] } = req.body;

  // Fetch the existing Paper to ensure it exists
  const existingPaper = await prisma.paper.findUnique({
    where: { id },
  });

  if (!existingPaper) {
    return next(new AppError('Paper not found', 404));
  }

  // Perform the update
  const updatedPaper = await prisma.paper.update({
    where: { id },
    data: {
      tags: {
        set: tagIds ? tagIds.map((tagId) => ({ id: tagId })) : [], // 'set' will replace existing tags with new ones
      },
    },
  });

  res.status(200).json({ message: 'Paper tags updated', paper: updatedPaper });
});

const deletePaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.paper.delete({
    where: { id },
  });

  res.status(204).send();
});

const updatePaperQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id, questionNumber: questionNumberString } = req.params; // Paper ID
  const { question }: { question: QuestionDTO } = req.body;

  const questionNumber = parseInt(questionNumberString);

  console.log({ paperId: id, question });

  const paper = await prisma.paper.findUnique({
    where: { id },
    include: {
      questions: true, // Include related PaperQuestions to verify
    },
  });

  if (!paper) {
    return next(new AppError('Paper not found', 404));
  }

  console.log('Paper found');

  // Check if the question is associated with this paper
  const paperQuestion = paper.questions.find((pQuestion) => pQuestion.questionOrder === questionNumber);

  console.log({ paperQuestion });

  if (!paperQuestion) {
    return next(new AppError('Something went wrong', 500));
  }

  const questionId = paperQuestion.questionId;
  const updateExistingQuestion = questionId === question.id;

  console.log({ updateExistingQuestion });
  const user = (req as any).user as User;

  if (updateExistingQuestion) {
    console.log('Updating existing question');

    // Use transaction to handle all database operations
    const result = await prisma.$transaction(async (tx) => {
      // First get existing choices
      const existingChoices = await tx.questionChoice.findMany({
        where: { questionId: questionId },
        select: { id: true },
      });
      const existingChoiceIds = new Set(existingChoices.map((c) => c.id));

      // Update the question
      const updatedQuestion = await tx.question.update({
        where: { id: questionId },
        data: {
          text: question.text,
          isMultiCorrect: question.isMultiCorrect,
          choices: {
            // Delete choices that are not in the new set
            deleteMany: {
              id: {
                notIn: question.choices.map((choice) => choice.id as string),
              },
            },
            // Update existing choices
            updateMany: question.choices
              .filter((choice) => existingChoiceIds.has(choice.id as string))
              .map((choice) => ({
                where: { id: choice.id },
                data: {
                  text: choice.text,
                  isAnswer: choice.isAnswer,
                  choiceOrder: choice.choiceOrder,
                },
              })),
            // Create new choices (ones with IDs not in the database)
            createMany: {
              data: question.choices
                .filter((choice) => !existingChoiceIds.has(choice.id as string))
                .map((choice) => ({
                  text: choice.text,
                  isAnswer: choice.isAnswer,
                  choiceOrder: choice.choiceOrder,
                  createdById: user.id,
                })),
            },
          },
        },
        include: {
          choices: {
            orderBy: { choiceOrder: 'asc' },
          },
        },
      });

      return updatedQuestion;
    });

    return res.status(200).json({
      message: 'Question updated successfully',
      question: result,
    });
  } else {
    console.log('Creating new question');

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create question and its choices in one transaction
      const newQuestion = await tx.question.create({
        data: {
          text: question.text,
          isMultiCorrect: question.isMultiCorrect,
          createdBy: {
            connect: { id: user.id },
          },
          // Create choices inline with the question
          choices: question.choices?.length
            ? {
                createMany: {
                  data: question.choices.map((choice) => ({
                    text: choice.text,
                    isAnswer: choice.isAnswer,
                    choiceOrder: choice.choiceOrder,
                    createdById: user.id,
                  })),
                },
              }
            : undefined,
        },
        include: {
          choices: {
            orderBy: {
              choiceOrder: 'asc',
            },
          },
        },
      });

      // Update the paper question with the new question ID
      await tx.paperQuestion.update({
        where: {
          id: paperQuestion.id,
        },
        data: {
          questionId: newQuestion.id,
        },
      });

      return newQuestion;
    });

    return res.status(201).json({
      message: 'Question added successfully',
      question: result,
    });
  }
});

export default {
  createPaper,
  getPaper,
  getPapers,
  updatePaper,
  deletePaper,
  updateTagsForPaper,
  getPaperCount,
  updatePaperQuestion,
};
