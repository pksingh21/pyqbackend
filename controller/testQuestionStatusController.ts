import { Request, Response, NextFunction } from 'express';
import { PrismaClient, TestQuestionStatus, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { connect } from 'http2';

const prisma = new PrismaClient();

const createTestQuestionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { testQuestionStatus }: { testQuestionStatus: TestQuestionStatus } = req.body;
    const test = await prisma.test.findUnique({
        where: {
            id: testQuestionStatus.testId
        }
    })
    const question = await prisma.question.findUnique({
        where: {
            id: testQuestionStatus.questionId
        }
    })
    const user = (req as any).user as User;
    if (test && question) {
        const newTestQuestionStatus = await prisma.testQuestionStatus.create({
            data: {
                test: {
                    connect: {
                        id: test.id
                    }
                },
                question: {
                    connect: {
                        id: question.id
                    }
                },
                createdBy: {
                    connect: {
                        id: user.id
                    }
                },
                status: testQuestionStatus.status,
            },
        });

        res.status(201).json({ message: 'Test question status created', testQuestionStatus: newTestQuestionStatus });
    }
    return next(new AppError('test id not correct or question id or user id', 403));
});

const getTestQuestionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const testQuestionStatus = await prisma.testQuestionStatus.findUnique({
        where: { id: Number(id) },
    });

    if (!testQuestionStatus) return next(new AppError('Test question status not found', 404));

    res.status(200).json({ testQuestionStatus });
});

const updateTestQuestionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { testId, questionId, status }: { testId?: number; questionId?: number; status?: string } = req.body;
    const user = (req as any).user as User;

    // Fetch current entities if IDs are provided
    const test = testId ? await prisma.test.findUnique({ where: { id: testId } }) : null;
    const question = questionId ? await prisma.question.findUnique({ where: { id: questionId } }) : null;

    // Prepare the update data object
    const updateData: any = {};

    if (status !== undefined) {
        updateData.status = status;
    }

    if (test) {
        updateData.test = { connect: { id: test.id } };
    }

    if (question) {
        updateData.question = { connect: { id: question.id } };
    }

    if (user) {
        updateData.createdBy = { connect: { id: user.id } };
    }

    // Error handling if entities are not found
    if ((testId && !test) || (questionId && !question)) {
        return next(new AppError('Test ID or Question ID provided is incorrect', 404));
    }

    // Perform the update
    const updatedTestQuestionStatus = await prisma.testQuestionStatus.update({
        where: { id: Number(id) },
        data: updateData
    });

    res.status(200).json({ message: 'Test question status updated', testQuestionStatus: updatedTestQuestionStatus });
});

const deleteTestQuestionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.testQuestionStatus.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

const updateQuestionChoiceForTestQuestionStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { id } = req.params;
    const { choices }: { choices?: number[] } = req.body;

    // Fetch the existing TestQuestionStatus to ensure it exists
    const existingTestQuestionStatus = await prisma.testQuestionStatus.findUnique({
        where: { id: Number(id) }
    });

    if (!existingTestQuestionStatus) {
        return next(new AppError('TestQuestionStatus not found', 404));
    }


    // Perform the update
    const updatedTestQuestionStatus = await prisma.testQuestionStatus.update({
        where: { id: Number(id) },
        data: {
            choices: {
                set: choices ? choices.map(choiceId => ({ id: choiceId })) : [] // 'set' will replace existing choices with new ones
            }
        }
    })

    res.status(200).json({ message: 'TestQuestionStatus choices updated', testQuestionStatus: updatedTestQuestionStatus });
})

export { createTestQuestionStatus, getTestQuestionStatus, updateTestQuestionStatus, deleteTestQuestionStatus, updateQuestionChoiceForTestQuestionStatus };
