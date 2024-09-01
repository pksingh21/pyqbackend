import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Test, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

const createTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { testData }: { testData: Test } = req.body;
    const user = (req as any).user as User;
    const paper = await prisma.paper.findUnique({
        where: {
            id: testData.paperId
        }
    })
    if (paper) {
        const newTest = await prisma.test.create({
            data: {
                duration: testData.duration,
                startTime: testData.startTime,
                elapsedTime: testData.elapsedTime,
                paper: {
                    connect: {
                        id: paper.id
                    }
                },
                createdBy: {
                    connect: {
                        id: user.id
                    }
                }
            },
        });
        res.status(201).json({ message: 'Test created', test: newTest });
    }
    return next(new AppError('Paper id given is wrong', 403));
});

const getTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const test = await prisma.test.findUnique({
        where: { id: Number(id) },
    });

    if (!test) return next(new AppError('Test not found', 404));

    res.status(200).json({ test });
});

const updateTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { testData }: { testData: Partial<Test> } = req.body;

    // Optionally find the paper to check if it exists
    const paper = testData.paperId ? await prisma.paper.findUnique({
        where: { id: testData.paperId }
    }) : null;

    // Prepare the update data object
    const updateData: any = {};


    if (testData.duration !== undefined) {
        updateData.duration = testData.duration;
    }

    if (testData.startTime !== undefined) {
        updateData.startTime = testData.startTime;
    }

    if (testData.elapsedTime !== undefined) {
        updateData.elapsedTime = testData.elapsedTime;
    }

    if (paper) {
        updateData.paper = { connect: { id: paper.id } };
    }


    if (!paper && testData.paperId) {
        return next(new AppError('Paper with the given ID does not exist', 404));
    }

    // Perform the update
    const updatedTest = await prisma.test.update({
        where: { id: Number(id) },
        data: updateData
    });

    res.status(200).json({ message: 'Test updated', test: updatedTest });
});

const deleteTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.test.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

export { createTest, getTest, updateTest, deleteTest };
