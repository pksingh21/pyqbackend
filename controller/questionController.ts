import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Question, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

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
            correctMarks: content.correctMarks,
            incorrectMarks: content.incorrectMarks,
            createdBy: {
                connect: user
            }
        },
    });

    res.status(201).json({ message: 'Question created', question: newQuestion });
});

const getQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const question = await prisma.question.findUnique({
        where: { id: Number(id) },
    });

    if (!question) return next(new AppError('Question not found', 404));

    res.status(200).json({ question });
});

const updateQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { content }: { content: Question } = req.body;

    const updatedQuestion = await prisma.question.update({
        where: { id: Number(id) },
        data: {
            text: content.text,
            images: content.images,
            isMultiCorrect: content.isMultiCorrect,
            correctMarks: content.correctMarks,
            incorrectMarks: content.incorrectMarks,
        }
    });

    res.status(200).json({ message: 'Question updated', question: updatedQuestion });
});

const updateQuestionChoiceForQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // id of the question
    const { choiceIds }: { choiceIds?: number[] } = req.body;

    // Fetch the existing Question to ensure it exists
    const existingQuestion = await prisma.question.findUnique({
        where: { id: Number(id) },
        include: { choices: true } // Include existing choices
    });

    if (!existingQuestion) {
        return next(new AppError('Question not found', 404));
    }


    // Perform the update
    const updatedQuestion = await prisma.question.update({
        where: { id: Number(id) },
        data: {
            choices: {
                set: choiceIds ? choiceIds.map(choiceId => ({ id: choiceId })) : [] // 'set' will replace existing choices with new ones
            }
        }
    });

    res.status(200).json({ message: 'Question choices updated', question: updatedQuestion });
});


const deleteQuestion = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.question.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

export { createQuestion, getQuestion, updateQuestion, deleteQuestion, updateQuestionChoiceForQuestion };
