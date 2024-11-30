import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Paper, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CreatePaperDTO } from '../dtos';

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

  const questionData = Array.from({ length: paper.questionCount }).map(() => ({
    questionOrder: 0, // placeholder values
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
        include: {
          question: true, // Populate the actual Question inside each PaperQuestion
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

export default { createPaper, getPaper, getPapers, updatePaper, deletePaper, updateTagsForPaper, getPaperCount };
