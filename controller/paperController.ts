import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Paper, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

const createPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { paper }: { paper: Paper } = req.body;
    const user = (req as any).user as User;

    const newPaper = await prisma.paper.create({
        data: {
            title: paper.title,
            isModule: paper.isModule,
            duration: paper.duration,
            createdBy: {
                connect: {
                    id: user.id
                }
            }
        },
    });

    res.status(201).json({ message: 'Paper created', paper: newPaper });
});

const getPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const paper = await prisma.paper.findUnique({
        where: { id: Number(id) },
    });

    if (!paper) return next(new AppError('Paper not found', 404));

    res.status(200).json({ paper });
});

const updatePaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { paper }: { paper: Partial<Paper> } = req.body;

    // Find the Paper to ensure it exists
    const existingPaper = await prisma.paper.findUnique({
        where: { id: Number(id) }
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
        where: { id: Number(id) },
        data: updateData
    });

    res.status(200).json({ message: 'Paper updated', paper: updatedPaper })
});

const updateTagsForPaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { tagIds }: { tagIds?: number[] } = req.body;

    // Fetch the existing Paper to ensure it exists
    const existingPaper = await prisma.paper.findUnique({
        where: { id: Number(id) }
    });

    if (!existingPaper) {
        return next(new AppError('Paper not found', 404));
    }


    // Perform the update
    const updatedPaper = await prisma.paper.update({
        where: { id: Number(id) },
        data: {
            tags: {

                set: tagIds ? tagIds.map(tagId => ({ id: tagId })) : [] // 'set' will replace existing tags with new ones
            }
        }
    });

    res.status(200).json({ message: 'Paper tags updated', paper: updatedPaper });
});


const deletePaper = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.paper.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

export { createPaper, getPaper, updatePaper, deletePaper, updateTagsForPaper };
