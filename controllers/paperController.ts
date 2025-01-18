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
    // Update the existing question and its choices
    const updatedQuestion = await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        text: question.text,
        isMultiCorrect: question.isMultiCorrect,
      },
      include: { choices: true }, // Include existing choices for comparison
    });

    const existingChoices = updatedQuestion.choices;

    // Determine choices to update, create, or delete
    const choicesToUpdate: ChoiceDTO[] = [];
    const choicesToCreate: ChoiceDTO[] = [];
    const choicesToDelete: string[] = [];

    question.choices.forEach((newChoice) => {
      const matchingChoice = existingChoices.find((c) => c.id === newChoice.id);
      if (matchingChoice) {
        // Update if the data has changed
        if (
          matchingChoice.text !== newChoice.text ||
          matchingChoice.isAnswer !== newChoice.isAnswer ||
          matchingChoice.choiceOrder !== newChoice.choiceOrder
        ) {
          choicesToUpdate.push(newChoice);
        }
      } else {
        // Create new choice
        choicesToCreate.push(newChoice);
      }
    });

    // Find choices to delete
    existingChoices.forEach((existingChoice) => {
      if (!question.choices.find((newChoice) => newChoice.id === existingChoice.id)) {
        choicesToDelete.push(existingChoice.id);
      }
    });

    // Execute updates, creations, and deletions for choices
    await Promise.all(
      choicesToUpdate.map((choice) =>
        prisma.questionChoice.update({
          where: {
            id: choice.id,
          },
          data: {
            text: choice.text,
            isAnswer: choice.isAnswer,
            choiceOrder: choice.choiceOrder,
          },
        })
      )
    );

    await prisma.questionChoice.createMany({
      data: choicesToCreate.map((choice) => ({
        text: choice.text,
        isAnswer: choice.isAnswer,
        choiceOrder: choice.choiceOrder,
        questionId: questionId,
        createdById: user.id,
      })),
    });

    await prisma.questionChoice.deleteMany({
      where: {
        id: { in: choicesToDelete },
      },
    });

    return res.status(200).json({
      message: 'Question updated successfully',
      question: {
        ...updatedQuestion,
        choices: await prisma.questionChoice.findMany({
          where: { questionId: question.id },
          orderBy: { choiceOrder: 'asc' },
        }),
      },
    });
  } else {
    console.log('Creating new question');
    // Create a new question and associate it with the paper
    const newQuestion = await prisma.question.create({
      data: {
        text: question.text,
        isMultiCorrect: question.isMultiCorrect,
        createdBy: {
          connect: { id: user.id },
        },
      },
    });

    console.log(`Linking this question as ${questionNumber} to paper ${id}`);

    await prisma.paperQuestion.update({
      where: {
        id: paperQuestion.id,
      },
      data: {
        questionId: newQuestion.id,
      },
    });

    if (question.choices && question.choices.length > 0) {
      await prisma.questionChoice.createMany({
        data: question.choices.map((choice) => ({
          text: choice.text,
          isAnswer: choice.isAnswer,
          choiceOrder: choice.choiceOrder,
          questionId: newQuestion.id,
          createdById: user.id,
        })),
      });

      console.log('Choices created and linked to question -', newQuestion.id);
    }

    return res.status(201).json({
      message: 'Question added successfully',
      question: {
        ...newQuestion,
        choices: await prisma.questionChoice.findMany({
          where: { questionId: newQuestion.id },
          orderBy: { choiceOrder: 'asc' },
        }),
      },
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
