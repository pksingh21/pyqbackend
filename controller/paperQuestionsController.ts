import { Request, Response, NextFunction } from 'express';
import { PrismaClient, PaperQuestion, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

const createPaperQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { paperQuestion }: { paperQuestion: PaperQuestion } = req.body;
    const user = (req as any).user as User;
    const paper = await prisma.paper.findUnique({
        where: {
            id: paperQuestion.paperId
        }
    })
    const question = await prisma.question.findUnique({
        where: {
            id: paperQuestion.questionId
        }
    })
    if (paper && question) {
        const newPaperQuestion = await prisma.paperQuestion.create({
            data: {
                questionOrder: paperQuestion.id,
                createdBy: {
                    connect: {
                        id: user.id
                    }
                },
                paper: {
                    connect: {
                        id: paper.id
                    }
                },
                question: {
                    connect: {
                        id: question.id
                    }
                }
            }
        });
        res.status(201).json({ message: 'Paper question created', paperQuestion: newPaperQuestion });
    }

    return next(new AppError('paper or question might be not there', 403));
});

const getPaperQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const paperQuestion = await prisma.paperQuestion.findUnique({
        where: { id: Number(id) },
    });

    if (!paperQuestion) return next(new AppError('Paper question not found', 404));

    res.status(200).json({ paperQuestion });
});

const updatePaperQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { paperQuestion }: { paperQuestion: Partial<PaperQuestion> } = req.body;

    // Find the Paper and Question to ensure they exist
    const paper = paperQuestion.paperId ? await prisma.paper.findUnique({
        where: { id: paperQuestion.paperId }
    }) : null;

    const question = paperQuestion.questionId ? await prisma.question.findUnique({
        where: { id: paperQuestion.questionId }
    }) : null;

    if (!paper && paperQuestion.paperId) {
        return next(new AppError('Paper with the given ID does not exist', 404));
    }

    if (!question && paperQuestion.questionId) {
        return next(new AppError('Question with the given ID does not exist', 404));
    }

    // Prepare the update data object
    const updateData: any = {};

    if (paperQuestion.questionOrder !== undefined) {
        updateData.questionOrder = paperQuestion.questionOrder;
    }

    if (paper) {
        updateData.paper = { connect: { id: paper.id } };
    }

    if (question) {
        updateData.question = { connect: { id: question.id } };
    }

    // Perform the update
    const updatedPaperQuestion = await prisma.paperQuestion.update({
        where: { id: parseInt(id) },
        data: updateData
    });

    res.status(200).json({ message: 'Paper question updated', paperQuestion: updatedPaperQuestion });
});

const deletePaperQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.paperQuestion.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

export { createPaperQuestion, getPaperQuestion, updatePaperQuestion, deletePaperQuestion };
